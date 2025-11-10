import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, Check, X, Loader2, Bell, Settings } from 'lucide-react';

interface NotificationConfig {
  sendgrid: { enabled: boolean; configured: boolean };
  mailgun: { enabled: boolean; configured: boolean };
  twilio: { enabled: boolean; configured: boolean };
}

interface NotificationPanelProps {
  accessToken: string;
}

export function NotificationPanel({ accessToken }: NotificationPanelProps) {
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sendgrid' | 'mailgun' | 'twilio' | 'campaign'>('sendgrid');
  
  // SendGrid Form
  const [sendgridApiKey, setSendgridApiKey] = useState('');
  const [sendgridFromEmail, setSendgridFromEmail] = useState('');
  
  // Mailgun Form
  const [mailgunApiKey, setMailgunApiKey] = useState('');
  const [mailgunDomain, setMailgunDomain] = useState('');
  const [mailgunFromEmail, setMailgunFromEmail] = useState('');
  
  // Twilio Form
  const [twilioAccountSid, setTwilioAccountSid] = useState('');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');
  const [twilioFromPhone, setTwilioFromPhone] = useState('');
  
  // Test notification
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  
  // Campaign
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignHeadline, setCampaignHeadline] = useState('');
  const [campaignSubheadline, setCampaignSubheadline] = useState('');
  const [campaignBody, setCampaignBody] = useState('');
  const [campaignCTA, setCampaignCTA] = useState('Shop Now');
  const [campaignCTAUrl, setCampaignCTAUrl] = useState('https://threadtrends.com/shop');
  const [campaignRecipients, setCampaignRecipients] = useState('');
  const [campaignLoading, setCampaignLoading] = useState(false);
  
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch('http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/config', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  };

  const configureSendGrid = async () => {
    try {
      const response = await fetch('http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/config/sendgrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          apiKey: sendgridApiKey,
          fromEmail: sendgridFromEmail
        })
      });

      if (response.ok) {
        showNotification('success', 'SendGrid configured successfully!');
        fetchConfig();
        setSendgridApiKey('');
        setSendgridFromEmail('');
      } else {
        const error = await response.json();
        showNotification('error', error.error || 'Failed to configure SendGrid');
      }
    } catch (error) {
      showNotification('error', 'Network error');
    }
  };

  const configureMailgun = async () => {
    try {
      const response = await fetch('http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/config/mailgun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          apiKey: mailgunApiKey,
          domain: mailgunDomain,
          fromEmail: mailgunFromEmail
        })
      });

      if (response.ok) {
        showNotification('success', 'Mailgun configured successfully!');
        fetchConfig();
        setMailgunApiKey('');
        setMailgunDomain('');
        setMailgunFromEmail('');
      } else {
        const error = await response.json();
        showNotification('error', error.error || 'Failed to configure Mailgun');
      }
    } catch (error) {
      showNotification('error', 'Network error');
    }
  };

  const configureTwilio = async () => {
    try {
      const response = await fetch('http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/config/twilio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          accountSid: twilioAccountSid,
          authToken: twilioAuthToken,
          fromPhone: twilioFromPhone
        })
      });

      if (response.ok) {
        showNotification('success', 'Twilio configured successfully!');
        fetchConfig();
        setTwilioAccountSid('');
        setTwilioAuthToken('');
        setTwilioFromPhone('');
      } else {
        const error = await response.json();
        showNotification('error', error.error || 'Failed to configure Twilio');
      }
    } catch (error) {
      showNotification('error', 'Network error');
    }
  };

  const sendTestEmail = async () => {
    setTestLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          type: 'email',
          recipient: testEmail
        })
      });

      const data = await response.json();
      showNotification(data.success ? 'success' : 'error', data.message);
    } catch (error) {
      showNotification('error', 'Failed to send test email');
    } finally {
      setTestLoading(false);
    }
  };

  const sendTestSMS = async () => {
    setTestLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          type: 'sms',
          recipient: testPhone
        })
      });

      const data = await response.json();
      showNotification(data.success ? 'success' : 'error', data.message);
    } catch (error) {
      showNotification('error', 'Failed to send test SMS');
    } finally {
      setTestLoading(false);
    }
  };

  const sendCampaign = async () => {
    setCampaignLoading(true);
    try {
      const recipients = campaignRecipients.split(',').map(e => e.trim()).filter(Boolean);
      
      const response = await fetch('http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          recipients,
          campaignData: {
            subject: campaignSubject,
            headline: campaignHeadline,
            subheadline: campaignSubheadline,
            body: campaignBody,
            ctaText: campaignCTA,
            ctaUrl: campaignCTAUrl
          }
        })
      });

      const data = await response.json();
      showNotification('success', data.message);
      
      // Reset form
      setCampaignSubject('');
      setCampaignHeadline('');
      setCampaignSubheadline('');
      setCampaignBody('');
      setCampaignRecipients('');
    } catch (error) {
      showNotification('error', 'Failed to send campaign');
    } finally {
      setCampaignLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications & Marketing</h2>
          <p className="text-sm text-gray-500">Configure email/SMS providers and send campaigns</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center gap-2`}>
          {notification.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-xl border-2 ${config?.sendgrid.configured ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">SendGrid (Email)</h3>
            {config?.sendgrid.configured ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {config?.sendgrid.configured ? 'Active & Configured' : 'Not Configured'}
          </p>
        </div>

        <div className={`p-6 rounded-xl border-2 ${config?.mailgun.configured ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Mailgun (Email)</h3>
            {config?.mailgun.configured ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {config?.mailgun.configured ? 'Active & Configured' : 'Not Configured'}
          </p>
        </div>

        <div className={`p-6 rounded-xl border-2 ${config?.twilio.configured ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Twilio (SMS)</h3>
            {config?.twilio.configured ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            {config?.twilio.configured ? 'Active & Configured' : 'Not Configured'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          {[
            { id: 'sendgrid', label: 'SendGrid Setup', icon: Mail },
            { id: 'mailgun', label: 'Mailgun Setup', icon: Mail },
            { id: 'twilio', label: 'Twilio Setup', icon: MessageSquare },
            { id: 'campaign', label: 'Send Campaign', icon: Send }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        {activeTab === 'sendgrid' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Configure SendGrid</h3>
            <div>
              <label className="block text-sm mb-2 text-gray-700">API Key</label>
              <input
                type="password"
                value={sendgridApiKey}
                onChange={(e) => setSendgridApiKey(e.target.value)}
                placeholder="SG.xxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">From Email</label>
              <input
                type="email"
                value={sendgridFromEmail}
                onChange={(e) => setSendgridFromEmail(e.target.value)}
                placeholder="noreply@threadtrends.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <button
              onClick={configureSendGrid}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Configuration
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium mb-3 text-gray-900">Send Test Email</h4>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
                />
                <button
                  onClick={sendTestEmail}
                  disabled={testLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Test
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mailgun' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Configure Mailgun</h3>
            <div>
              <label className="block text-sm mb-2 text-gray-700">API Key</label>
              <input
                type="password"
                value={mailgunApiKey}
                onChange={(e) => setMailgunApiKey(e.target.value)}
                placeholder="key-xxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Domain</label>
              <input
                type="text"
                value={mailgunDomain}
                onChange={(e) => setMailgunDomain(e.target.value)}
                placeholder="mg.threadtrends.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">From Email</label>
              <input
                type="email"
                value={mailgunFromEmail}
                onChange={(e) => setMailgunFromEmail(e.target.value)}
                placeholder="noreply@threadtrends.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <button
              onClick={configureMailgun}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Configuration
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium mb-3 text-gray-900">Send Test Email</h4>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
                />
                <button
                  onClick={sendTestEmail}
                  disabled={testLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Test
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'twilio' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Configure Twilio</h3>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Account SID</label>
              <input
                type="text"
                value={twilioAccountSid}
                onChange={(e) => setTwilioAccountSid(e.target.value)}
                placeholder="ACxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">Auth Token</label>
              <input
                type="password"
                value={twilioAuthToken}
                onChange={(e) => setTwilioAuthToken(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700">From Phone Number</label>
              <input
                type="tel"
                value={twilioFromPhone}
                onChange={(e) => setTwilioFromPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>
            <button
              onClick={configureTwilio}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Save Configuration
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium mb-3 text-gray-900">Send Test SMS</h4>
              <div className="flex gap-3">
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
                />
                <button
                  onClick={sendTestSMS}
                  disabled={testLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Test
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaign' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Create Marketing Campaign</h3>
            
            <div>
              <label className="block text-sm mb-2 text-gray-700">Email Subject</label>
              <input
                type="text"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="🔥 New Drop Alert! Limited Edition Tees"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Headline</label>
              <input
                type="text"
                value={campaignHeadline}
                onChange={(e) => setCampaignHeadline(e.target.value)}
                placeholder="NEW DROP ALERT"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Subheadline</label>
              <input
                type="text"
                value={campaignSubheadline}
                onChange={(e) => setCampaignSubheadline(e.target.value)}
                placeholder="Limited Edition Collection - Only 100 Pieces"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Email Body (HTML supported)</label>
              <textarea
                value={campaignBody}
                onChange={(e) => setCampaignBody(e.target.value)}
                rows={6}
                placeholder="<p>Check out our latest collection...</p>"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">CTA Button Text</label>
                <input
                  type="text"
                  value={campaignCTA}
                  onChange={(e) => setCampaignCTA(e.target.value)}
                  placeholder="Shop Now"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">CTA URL</label>
                <input
                  type="url"
                  value={campaignCTAUrl}
                  onChange={(e) => setCampaignCTAUrl(e.target.value)}
                  placeholder="https://threadtrends.com/shop"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">Recipients (comma-separated emails)</label>
              <textarea
                value={campaignRecipients}
                onChange={(e) => setCampaignRecipients(e.target.value)}
                rows={3}
                placeholder="user1@example.com, user2@example.com, user3@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple email addresses with commas
              </p>
            </div>

            <button
              onClick={sendCampaign}
              disabled={campaignLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {campaignLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Campaign...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Campaign
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">How to Get API Keys</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li><strong>SendGrid:</strong> Sign up at sendgrid.com → Settings → API Keys → Create API Key</li>
              <li><strong>Mailgun:</strong> Sign up at mailgun.com → Settings → API Keys → Copy Private API Key</li>
              <li><strong>Twilio:</strong> Sign up at twilio.com → Console → Account SID & Auth Token</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
