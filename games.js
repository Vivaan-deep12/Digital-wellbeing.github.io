/* Digital Edge — games.js */

// Generic quiz engine
function Quiz({ mount, title, questions, advice }) {
  const root = document.querySelector(mount);
  if (!root) return;
  let i = 0, score = 0, answered = false;

  function render() {
    if (i >= questions.length) return renderResults();
    const q = questions[i];
    const pct = (i / questions.length) * 100;
    root.innerHTML = `
      <div class="game-head">
        <div class="game-title">${title}</div>
        <div class="game-meta">
          <div class="score-chip">Score: <span>${score}</span></div>
          <div class="score-chip">${i + 1} / ${questions.length}</div>
        </div>
      </div>
      <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
      <div class="question"><span class="label">${q.label || 'Question'}</span><div>${q.text}</div></div>
      <div class="choices">
        ${q.choices.map((c, idx) => `<button class="choice" data-i="${idx}">${c.text}</button>`).join('')}
      </div>
      <div class="feedback" id="fb" style="display:none"></div>
      <div class="game-actions"><button class="btn btn-primary" id="next" style="display:none">Next →</button></div>
    `;
    answered = false;
    root.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const idx = +btn.dataset.i;
        const choice = q.choices[idx];
        const correct = choice.correct;
        btn.classList.add(correct ? 'correct' : 'wrong');
        if (correct) score += q.points || 10;
        else score = Math.max(0, score - (q.penalty || 0));
        const fb = root.querySelector('#fb');
        fb.style.display = 'block';
        fb.className = 'feedback ' + (correct ? 'good' : 'bad');
        fb.innerHTML = `<strong>${correct ? 'Correct!' : 'Not quite.'}</strong> ${choice.explain || q.explain || ''}`;
        root.querySelector('#next').style.display = 'inline-flex';
        root.querySelector('.score-chip span').textContent = score;
      });
    });
    root.querySelector('#next').addEventListener('click', () => { i++; render(); });
  }

  function renderResults() {
    const max = questions.reduce((s, q) => s + (q.points || 10), 0);
    const pct = Math.round((score / max) * 100);
    let verdict = 'Keep practicing!';
    if (pct >= 80) verdict = 'Outstanding!';
    else if (pct >= 60) verdict = 'Solid work.';
    else if (pct >= 40) verdict = 'On the way.';
    const a = (advice && advice(pct)) || 'Review the page and try again to lock in the ideas.';
    root.innerHTML = `
      <div class="results">
        <div class="big">${pct}%</div>
        <div class="verdict">${verdict}</div>
        <div class="advice">${a}</div>
        <button class="btn btn-primary" id="restart">↻ Play again</button>
      </div>
    `;
    root.querySelector('#restart').addEventListener('click', () => { i = 0; score = 0; render(); });
  }

  render();
}

/* ========== Build Your Identity ========== */
function initIdentityBuilder() {
  const root = document.querySelector('#game-identity');
  if (!root) return;
  const actions = [
    { text: 'Post your school achievements', delta: +12 },
    { text: 'Help a classmate online', delta: +10 },
    { text: 'Share a thoughtful blog post', delta: +14 },
    { text: 'Leave a rude comment on a video', delta: -16 },
    { text: 'Spread a rumour you didn’t verify', delta: -18 },
    { text: 'Upload an inappropriate photo', delta: -22 },
    { text: 'Volunteer for a charity event online', delta: +15 },
    { text: 'Cyberbully someone in a game lobby', delta: -25 },
    { text: 'Post a respectful debate response', delta: +9 },
    { text: 'Share misinformation as a joke', delta: -14 },
  ];
  let score = 50;
  function render() {
    root.innerHTML = `
      <div class="game-head">
        <div class="game-title">Build Your Identity</div>
        <div class="game-meta"><div class="score-chip">Identity Score: <span>${score}</span></div></div>
      </div>
      <div class="identity-meter">
        <div class="bar"><div style="width:${score}%"></div></div>
        <div class="val">${score}/100</div>
      </div>
      <p class="section-sub">Tap actions to see how each choice shapes your digital identity.</p>
      <div class="choices">
        ${actions.map((a, i) => `<button class="choice" data-i="${i}">${a.delta > 0 ? '✨' : '⚠️'} ${a.text} <span style="float:right;color:${a.delta>0?'#22c55e':'#ef4444'};font-weight:700">${a.delta>0?'+':''}${a.delta}</span></button>`).join('')}
      </div>
      <div class="game-actions"><button class="btn btn-ghost" id="reset">Reset</button></div>
    `;
    root.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.i;
        score = Math.max(0, Math.min(100, score + actions[i].delta));
        render();
      });
    });
    root.querySelector('#reset').addEventListener('click', () => { score = 50; render(); });
  }
  render();
}

/* ========== Footprint Detective ========== */
function initFootprint() {
  Quiz({
    mount: '#game-footprint',
    title: 'Footprint Detective',
    questions: [
      { text: 'You post a selfie on social media.', choices: [
        { text: 'Active footprint', correct: true, explain: 'You intentionally shared content.' },
        { text: 'Passive footprint', correct: false }
      ]},
      { text: 'A website saves cookies that track your browsing.', choices: [
        { text: 'Active footprint', correct: false },
        { text: 'Passive footprint', correct: true, explain: 'Data collected without you doing anything visible.' }
      ]},
      { text: 'You like a friend’s post.', choices: [
        { text: 'Active footprint', correct: true, explain: 'You took an action that the platform records.' },
        { text: 'Passive footprint', correct: false }
      ]},
      { text: 'Your phone shares location data with an app in the background.', choices: [
        { text: 'Active footprint', correct: false },
        { text: 'Passive footprint', correct: true, explain: 'Collected automatically by the app.' }
      ]},
      { text: 'You leave a comment on a YouTube video.', choices: [
        { text: 'Active footprint', correct: true },
        { text: 'Passive footprint', correct: false, explain: 'Comments are deliberate posts.' }
      ]},
      { text: 'An ad network logs which pages you visit.', choices: [
        { text: 'Active footprint', correct: false },
        { text: 'Passive footprint', correct: true }
      ]},
    ],
    advice: (pct) => pct >= 80
      ? 'You can spot the difference clearly. Use privacy settings to limit passive tracking.'
      : 'Remember: anything you choose to do is active; anything collected silently is passive.'
  });
}

/* ========== Reputation Builder ========== */
function initReputation() {
  Quiz({
    mount: '#game-reputation',
    title: 'Reputation Builder',
    questions: [
      { text: 'A teacher praised your project. What do you post?', choices: [
        { text: 'Thank you! Sharing what I learned about renewables ↓', correct: true, explain: 'Positive, useful, on-brand.' },
        { text: 'Finally got noticed. About time these losers saw me.', correct: false, explain: 'Insults damage how people see you.' }
      ]},
      { text: 'You disagree with someone in the comments.', choices: [
        { text: 'Insult them publicly', correct: false },
        { text: 'Reply respectfully with your reasoning', correct: true, explain: 'Civil disagreement builds credibility.' }
      ]},
      { text: 'A friend shares a rumour about a classmate.', choices: [
        { text: 'Reshare to your followers', correct: false, explain: 'Spreading unverified info hurts others and your reputation.' },
        { text: 'Don’t share, check the facts first', correct: true }
      ]},
      { text: 'You’re proud of finishing a 5K run.', choices: [
        { text: 'Post a photo with your time', correct: true, explain: 'Sharing genuine wins is great.' },
        { text: 'Brag and put down people who didn’t finish', correct: false }
      ]},
      { text: 'A stranger leaves a mean comment.', choices: [
        { text: 'Reply with worse insults', correct: false },
        { text: 'Block, report, ignore', correct: true, explain: 'Don’t feed trolls — protect your space.' }
      ]},
    ],
    advice: (pct) => pct >= 80
      ? 'You’re building a reputation that opens doors. Keep it consistent.'
      : 'Pause before posting and ask: would I be proud of this in 5 years?'
  });
}

/* ========== Password Strength Challenge ========== */
function initPassword() {
  const root = document.querySelector('#game-password');
  if (!root) return;
  root.innerHTML = `
    <div class="game-head">
      <div class="game-title">Password Strength Challenge</div>
      <div class="game-meta"><div class="score-chip">Strength: <span id="pw-score">0%</span></div></div>
    </div>
    <div class="pw-wrap">
      <input class="pw-input" id="pw" type="text" placeholder="Type a password to test..." autocomplete="off" />
      <div class="pw-meter"><div id="pw-bar"></div></div>
      <div class="pw-rules">
        <div data-r="len">At least 12 characters</div>
        <div data-r="upper">Includes uppercase letter</div>
        <div data-r="lower">Includes lowercase letter</div>
        <div data-r="num">Includes a number</div>
        <div data-r="sym">Includes a symbol</div>
        <div data-r="nocommon">Avoids common words ("password", "qwerty", "1234"...)</div>
      </div>
      <div class="feedback" id="pw-fb" style="display:none"></div>
    </div>
  `;
  const input = root.querySelector('#pw');
  const bar = root.querySelector('#pw-bar');
  const scoreEl = root.querySelector('#pw-score');
  const fb = root.querySelector('#pw-fb');
  const common = ['password','qwerty','1234','letmein','iloveyou','admin','welcome','abc123','111111','dragon'];
  function check() {
    const v = input.value;
    const rules = {
      len: v.length >= 12,
      upper: /[A-Z]/.test(v),
      lower: /[a-z]/.test(v),
      num: /\d/.test(v),
      sym: /[^A-Za-z0-9]/.test(v),
      nocommon: v.length > 0 && !common.some(c => v.toLowerCase().includes(c)),
    };
    let passed = 0;
    Object.entries(rules).forEach(([k, ok]) => {
      const el = root.querySelector(`[data-r="${k}"]`);
      el.classList.toggle('ok', ok);
      if (ok) passed++;
    });
    const pct = Math.round((passed / 6) * 100);
    bar.style.width = pct + '%';
    let color = '#ef4444';
    if (pct >= 80) color = '#22c55e';
    else if (pct >= 50) color = '#eab308';
    bar.style.background = pct >= 80 ? 'var(--grad)' : color;
    scoreEl.textContent = pct + '%';
    if (v.length === 0) { fb.style.display = 'none'; return; }
    fb.style.display = 'block';
    fb.className = 'feedback ' + (pct >= 80 ? 'good' : pct >= 50 ? '' : 'bad');
    fb.innerHTML = pct >= 80
      ? '<strong>Strong password!</strong> Hard to guess and brute force.'
      : pct >= 50 ? '<strong>Decent.</strong> Add more variety or length to strengthen it.'
      : '<strong>Weak.</strong> Easy to crack — keep adding rules above.';
  }
  input.addEventListener('input', check);
}

/* ========== Wellbeing Quiz ========== */
function initWellbeing() {
  const root = document.querySelector('#game-wellbeing');
  if (!root) return;
  const qs = [
    { q: 'How many hours of recreational screen time per day?', opts: [
      { t: 'Less than 2', s: 4 }, { t: '2 – 4', s: 3 }, { t: '4 – 6', s: 2 }, { t: '6+', s: 1 }
    ]},
    { q: 'Do you use your phone in the hour before sleep?', opts: [
      { t: 'Never', s: 4 }, { t: 'Sometimes', s: 3 }, { t: 'Often', s: 2 }, { t: 'Always', s: 1 }
    ]},
    { q: 'Do you take regular breaks from screens?', opts: [
      { t: 'Every 30 min', s: 4 }, { t: 'Every hour', s: 3 }, { t: 'Rarely', s: 2 }, { t: 'Never', s: 1 }
    ]},
    { q: 'Do you spend time outside daily?', opts: [
      { t: 'Yes, 1+ hour', s: 4 }, { t: 'A bit', s: 3 }, { t: 'Hardly', s: 2 }, { t: 'No', s: 1 }
    ]},
    { q: 'How do you feel after long social media use?', opts: [
      { t: 'Fine', s: 4 }, { t: 'A little tired', s: 3 }, { t: 'Anxious', s: 2 }, { t: 'Drained', s: 1 }
    ]},
    { q: 'Notifications during focus time?', opts: [
      { t: 'All silenced', s: 4 }, { t: 'Important only', s: 3 }, { t: 'Most on', s: 2 }, { t: 'All on', s: 1 }
    ]},
  ];
  let i = 0, score = 0;
  function render() {
    if (i >= qs.length) return results();
    const q = qs[i];
    root.innerHTML = `
      <div class="game-head">
        <div class="game-title">Digital Wellbeing Quiz</div>
        <div class="game-meta"><div class="score-chip">${i+1} / ${qs.length}</div></div>
      </div>
      <div class="progress"><div class="progress-bar" style="width:${(i/qs.length)*100}%"></div></div>
      <div class="question"><span class="label">Question</span><div>${q.q}</div></div>
      <div class="choices">
        ${q.opts.map((o, idx) => `<button class="choice" data-i="${idx}">${o.t}</button>`).join('')}
      </div>
    `;
    root.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => { score += q.opts[+btn.dataset.i].s; i++; render(); });
    });
  }
  function results() {
    const max = qs.length * 4;
    const pct = Math.round((score / max) * 100);
    let verdict, advice;
    if (pct >= 80) { verdict = 'Excellent digital wellbeing'; advice = 'You’ve built strong habits — keep modelling them for friends.'; }
    else if (pct >= 60) { verdict = 'Good balance'; advice = 'Small tweaks like silencing notifications can raise this further.'; }
    else if (pct >= 40) { verdict = 'Needs attention'; advice = 'Try screen-free time before bed and breaks every 30 minutes.'; }
    else { verdict = 'Reset recommended'; advice = 'Schedule device-free hours, outdoor time, and a real sleep routine.'; }
    root.innerHTML = `
      <div class="results">
        <div class="big">${pct}%</div>
        <div class="verdict">${verdict}</div>
        <div class="advice">${advice}</div>
        <button class="btn btn-primary" id="restart">↻ Retake</button>
      </div>`;
    root.querySelector('#restart').addEventListener('click', () => { i = 0; score = 0; render(); });
  }
  render();
}

/* ========== Spot The Scam ========== */
function initScam() {
  const messages = [
    { from: 'BankOfAustralia <secure@bank-aus-verify.com>', subj: 'URGENT: Your account will be locked', body: 'Click here within 24 hours to verify your password or lose access forever.', scam: true, why: 'Urgency, suspicious domain, asks for password.' },
    { from: 'Mum', subj: 'Pick up milk?', body: 'On your way home, can you grab some milk?', scam: false, why: 'Personal, no links, normal request.' },
    { from: 'Netflix <no-reply@netflix.com>', subj: 'Your billing receipt', body: 'Thanks for your payment. View invoice in your account at netflix.com.', scam: false, why: 'Real domain, no urgency, no credential request.' },
    { from: 'Prize <win@lottery-international.xyz>', subj: 'You won $850,000!!!', body: 'Send your bank details and a $50 fee to claim your prize.', scam: true, why: 'Too good to be true, asks for fee and bank details.' },
    { from: 'IT Helpdesk <support@helpdesk-team.support>', subj: 'Password reset required', body: 'Reply with your current password so we can reset it on our end.', scam: true, why: 'No real IT team asks for your password.' },
    { from: 'School', subj: 'Term newsletter', body: 'Read the latest updates in the attached PDF, available in the parent portal.', scam: false, why: 'Expected, no credentials requested.' },
  ];
  Quiz({
    mount: '#game-scam',
    title: 'Spot The Scam',
    questions: messages.map(m => ({
      label: 'Inbox',
      text: `<div class="scenario"><div class="from">From: ${m.from}</div><div class="subj">${m.subj}</div><div class="body">${m.body}</div></div>`,
      choices: [
        { text: '🚨 Scam', correct: m.scam, explain: m.why },
        { text: '✅ Legitimate', correct: !m.scam, explain: m.why },
      ]
    })),
    advice: (pct) => pct >= 80 ? 'Sharp eyes! Trust your instincts and verify links.' : 'Look for urgency, weird domains, and password requests.'
  });
}

/* ========== Gaming Safe or Unsafe ========== */
function initGaming() {
  Quiz({
    mount: '#game-gaming',
    title: 'Safe or Unsafe',
    questions: [
      { text: 'A teammate asks for your real address to send you a "gift card".', choices: [
        { text: 'Unsafe', correct: true, explain: 'Never share personal info, even for "gifts".' },
        { text: 'Safe', correct: false }
      ]},
      { text: 'You enable two-factor authentication on your gaming account.', choices: [
        { text: 'Unsafe', correct: false },
        { text: 'Safe', correct: true, explain: '2FA stops most account takeovers.' }
      ]},
      { text: 'A pop-up promises free V-Bucks if you log in via a link.', choices: [
        { text: 'Unsafe', correct: true, explain: 'Classic phishing — never log in via random links.' },
        { text: 'Safe', correct: false }
      ]},
      { text: 'You mute and report a player who is harassing someone.', choices: [
        { text: 'Unsafe', correct: false },
        { text: 'Safe', correct: true }
      ]},
      { text: 'You voice-chat with a stranger who asks for a selfie.', choices: [
        { text: 'Unsafe', correct: true, explain: 'Strangers asking for personal photos is a red flag.' },
        { text: 'Safe', correct: false }
      ]},
      { text: 'You spend pocket money inside a verified in-app store with a parent.', choices: [
        { text: 'Unsafe', correct: false },
        { text: 'Safe', correct: true, explain: 'Verified stores + a trusted adult = safer purchases.' }
      ]},
    ],
    advice: (pct) => pct >= 80 ? 'You game smart. Stay alert in voice chats and friend requests.' : 'Default to: never share personal info, never log in via random links.'
  });
}

/* ========== Fact or Fake ========== */
function initFactFake() {
  Quiz({
    mount: '#game-factfake',
    title: 'Fact or Fake',
    questions: [
      { text: 'A viral TikTok claims a celebrity died. No major news outlets reported it.', choices: [
        { text: 'Fake', correct: true, explain: 'Big news would be covered by reputable outlets within hours.' },
        { text: 'Fact', correct: false }
      ]},
      { text: 'A scientific paper from a university reports a vaccine trial result.', choices: [
        { text: 'Fake', correct: false },
        { text: 'Fact', correct: true, explain: 'Peer-reviewed, attributed sources are stronger.' }
      ]},
      { text: 'A perfectly lit video of a politician saying something shocking, only on an anonymous account.', choices: [
        { text: 'Fake (possible deepfake)', correct: true, explain: 'Could be AI-generated. Verify with trusted news.' },
        { text: 'Fact', correct: false }
      ]},
      { text: 'A weather agency posts a cyclone warning on their official website.', choices: [
        { text: 'Fake', correct: false },
        { text: 'Fact', correct: true }
      ]},
      { text: 'A blog with no author claims "doctors hate this miracle cure".', choices: [
        { text: 'Fake', correct: true, explain: 'No author + emotional clickbait = unreliable.' },
        { text: 'Fact', correct: false }
      ]},
      { text: 'Two independent reputable newspapers report the same election result.', choices: [
        { text: 'Fake', correct: false },
        { text: 'Fact', correct: true, explain: 'Multiple credible sources cross-check the claim.' }
      ]},
    ],
    advice: (pct) => pct >= 80 ? 'You evaluate sources well. Always cross-check.' : 'Ask: who said it, where was it published, and is it confirmed elsewhere?'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initIdentityBuilder();
  initFootprint();
  initReputation();
  initPassword();
  initWellbeing();
  initScam();
  initGaming();
  initFactFake();
});
