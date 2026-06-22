/* Digital Edge — chatbot.js (offline, no API) */
const KB = [
  // Digital Identity
  { k: ['what is a digital identity','digital identity','define digital identity'], a: 'A digital identity is the collection of information about you that exists online and represents who you are on the internet.' },
  { k: ['why is digital identity important','why does digital identity matter'], a: 'Your digital identity affects education, jobs, scholarships, relationships, and your overall reputation — schools and employers often check.' },
  { k: ['positive digital identity','good digital identity','how to build a positive digital identity'], a: 'Communicate respectfully, share helpful content, post your achievements, and behave responsibly online.' },
  { k: ['negative digital identity','bad digital identity'], a: 'Cyberbullying, offensive comments, inappropriate content, and spreading misinformation all damage your digital identity.' },
  { k: ['how is digital identity created','what makes my digital identity'], a: 'Through social media, posts, comments, photos, videos, gaming accounts, search history, online purchases, and school or work accounts.' },

  // Footprint
  { k: ['what is a digital footprint','digital footprint','define digital footprint'], a: 'A digital footprint is the trail of information you leave behind when using the internet.' },
  { k: ['active digital footprint','what is active footprint'], a: 'An active footprint is created when you intentionally do something online — posting, uploading, commenting, or liking.' },
  { k: ['passive digital footprint','what is passive footprint'], a: 'A passive footprint is created automatically — websites track activity, apps collect data, cookies monitor browsing.' },
  { k: ['why digital footprints matter','why does my footprint matter'], a: 'They can remain online for years, be seen by schools or employers, affect future opportunities, and reveal personal information.' },
  { k: ['can i delete my digital footprint'], a: 'You can reduce it (delete posts, clear cookies, request data removal) but you usually cannot remove it completely.' },

  // Reputation
  { k: ['what is online reputation','online reputation'], a: 'Online reputation is how people perceive you based on your online presence — posts, photos, comments, and accounts.' },
  { k: ['why does online reputation matter'], a: 'Schools, universities, employers and others often search for you online before making decisions.' },
  { k: ['how to build a positive reputation'], a: 'Think before posting, be respectful, share useful content, protect your privacy, and avoid drama.' },
  { k: ['what damages reputation','things that damage reputation'], a: 'Cyberbullying, harmful comments, inappropriate posts, and false information all damage your reputation.' },

  // Privacy & Security
  { k: ['what is personal information','personal information'], a: 'Personal information includes your full name, address, school, phone number, email, passwords, and location.' },
  { k: ['strong password','how to create a strong password','password tips'], a: 'Use 12+ characters with uppercase, lowercase, numbers, and symbols. Avoid names, birthdays, and common words.' },
  { k: ['what is 2fa','two factor authentication','2fa'], a: 'Two-factor authentication adds an extra step (like a code on your phone) so even if someone learns your password, they cannot log in.' },
  { k: ['privacy settings'], a: 'Regularly review privacy settings on social media and apps — limit who can see your posts, location, and contact info.' },
  { k: ['public wifi safe','is public wifi safe'], a: 'Public Wi-Fi is risky for logging into accounts. Use a VPN or your mobile data for anything sensitive.' },

  // Wellbeing
  { k: ['what is digital wellbeing','digital wellbeing'], a: 'Digital wellbeing means maintaining a healthy and balanced relationship with technology.' },
  { k: ['why is digital wellbeing important'], a: 'It helps maintain a healthy balance between online and offline life, supporting your mental and physical health.' },
  { k: ['signs of good digital wellbeing'], a: 'Balanced screen time, healthy sleep, physical activity, positive interactions, and regular breaks from screens.' },
  { k: ['risks of too much screen time','screen time risks'], a: 'Sleep disruption, eye strain, reduced concentration, increased stress and anxiety.' },
  { k: ['healthy digital habits','how to improve digital wellbeing'], a: 'Take breaks, silence notifications, no screens before bed, get outdoors, and spend time with friends and family.' },

  // Scams & Phishing
  { k: ['what is phishing','phishing'], a: 'Phishing is when criminals pretend to be trusted organisations or people to trick you into sharing information.' },
  { k: ['scam warning signs','common scam signs'], a: 'Urgent messages, requests for passwords, suspicious links, threatening language, and offers that seem too good to be true.' },
  { k: ['how to stay safe from scams','avoid scams'], a: 'Verify senders, check URLs carefully, never share passwords, think before clicking, and ask a trusted adult if unsure.' },
  { k: ['what to do if i clicked a phishing link'], a: 'Disconnect from Wi-Fi, change passwords from a safe device, enable 2FA, and tell a trusted adult or your IT team.' },

  // Gaming
  { k: ['gaming risks','risks while gaming'], a: 'Online scams, cyberbullying, strangers, fake giveaways, and account theft are common gaming risks.' },
  { k: ['stay safe while gaming','gaming safety'], a: 'Never share personal info, use strong passwords, enable security features, report bad behaviour, and only talk to trusted players.' },
  { k: ['in-game purchases','in game purchases'], a: 'Spend responsibly, use parental approvals where possible, and never enter card details on unofficial sites.' },
  { k: ['someone is bullying me in a game','cyberbullying in games'], a: 'Mute and block them, report through the platform, save evidence (screenshots), and tell a trusted adult.' },

  // AI & Misinformation
  { k: ['what is artificial intelligence','what is ai'], a: 'AI is technology that performs tasks that normally require human intelligence — chatbots, voice assistants, recommendation systems and image generators.' },
  { k: ['what is misinformation','misinformation'], a: 'Misinformation is false or misleading information shared online — sometimes accidentally, sometimes on purpose.' },
  { k: ['what is a deepfake','deepfake'], a: 'A deepfake is a realistic but fake image, video, or audio clip made with AI to make someone appear to say or do something they didn’t.' },
  { k: ['how to verify information','spot fake news','fact check'], a: 'Check multiple sources, verify the author, look for evidence, check publication dates, and prefer trusted websites.' },
  { k: ['can ai be wrong','is ai always right'], a: 'No. AI can be confidently wrong, biased, or outdated. Always cross-check important answers.' },
];

const FALLBACK = "I'm still learning. Try asking about Digital Identity, Digital Footprints, Online Reputation, Privacy & Security, Digital Wellbeing, Scams & Phishing, Gaming Safety, or AI & Misinformation.";

function findAnswer(input) {
  const q = input.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return FALLBACK;
  // Greetings
  if (/^(hi|hello|hey|yo|sup)\b/.test(q)) return "Hey there! Ask me anything about digital wellbeing, safety, or online identity.";
  if (/thank/.test(q)) return "You're welcome! Stay safe out there.";
  // Score keyword matches
  let best = { score: 0, a: FALLBACK };
  KB.forEach(entry => {
    entry.k.forEach(key => {
      const words = key.split(' ');
      const hits = words.filter(w => q.includes(w)).length;
      const score = hits / words.length + (q.includes(key) ? 1 : 0);
      if (score > best.score) best = { score, a: entry.a };
    });
  });
  return best.score >= 0.55 ? best.a : FALLBACK;
}

function timestamp() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addBubble(body, who) {
  const wrap = document.querySelector('#chat-body');
  const b = document.createElement('div');
  b.className = 'bubble ' + who;
  b.innerHTML = `${body}<span class="time">${timestamp()}</span>`;
  wrap.appendChild(b);
  wrap.scrollTop = wrap.scrollHeight;
  return b;
}

function addTyping() {
  const wrap = document.querySelector('#chat-body');
  const b = document.createElement('div');
  b.className = 'bubble bot';
  b.id = 'typing';
  b.innerHTML = `<span class="typing"><span></span><span></span><span></span></span>`;
  wrap.appendChild(b);
  wrap.scrollTop = wrap.scrollHeight;
}
function removeTyping() { const t = document.querySelector('#typing'); if (t) t.remove(); }

function send(text) {
  if (!text.trim()) return;
  addBubble(text, 'user');
  addTyping();
  setTimeout(() => {
    removeTyping();
    addBubble(findAnswer(text), 'bot');
  }, 700 + Math.random() * 500);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#chat-form');
  const input = document.querySelector('#chat-input');
  if (!form) return;
  // Welcome
  addBubble("👋 Hi! I'm Edge — your digital wellbeing buddy. Ask me about identity, privacy, scams, gaming, AI or anything online.", 'bot');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input.value);
    input.value = '';
  });
  document.querySelectorAll('.suggestions button').forEach(b => {
    b.addEventListener('click', () => send(b.textContent));
  });
});
