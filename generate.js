// Load environment variables and Claude SDK
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Initialize Claude client
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Parse command-line arguments
function getArg(flag) {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : null;
}

// Read knowledge base files
function readKnowledgeBase() {
  const scriptsPath = path.join(__dirname, 'examples', 'WINNING_SCRIPTS.md');
  const visualPath = path.join(__dirname, 'examples', 'VISUAL_STYLE_GUIDE.md');
  const compliancePath = path.join(__dirname, 'examples', 'COMPLIANCE_APPROVED_LANGUAGE.md');
  const lessonsPath = path.join(__dirname, 'examples', 'lessons.md');  // ADD THIS
  
  let knowledge = '';
  
  if (fs.existsSync(scriptsPath)) {
    knowledge += '\n\n## WINNING SCRIPTS KNOWLEDGE:\n' + fs.readFileSync(scriptsPath, 'utf8');
  }
  
  if (fs.existsSync(visualPath)) {
    knowledge += '\n\n## VISUAL STYLE KNOWLEDGE:\n' + fs.readFileSync(visualPath, 'utf8');
  }
  
  if (fs.existsSync(compliancePath)) {
    knowledge += '\n\n## COMPLIANCE KNOWLEDGE:\n' + fs.readFileSync(compliancePath, 'utf8');
  }
  
  if (fs.existsSync(lessonsPath)) {  // ADD THIS
    knowledge += '\n\n## LESSONS LEARNED (HIGHEST PRIORITY - USER CORRECTIONS):\n' + fs.readFileSync(lessonsPath, 'utf8');
  }
  
  return knowledge;
}

// Main function
async function generateCreatives() {
  // Get inputs from command line
  const clientName = getArg('--client');
  const product = getArg('--product');
  const audience = getArg('--audience');
  const pain = getArg('--pain');
  const angle = getArg('--angle') || 'None specified';

  // Validate inputs
  if (!clientName || !product || !audience || !pain) {
    console.log('❌ Missing required arguments!');
    console.log('\nUsage:');
    console.log('node generate.js --client "Name" --product "IUL" --audience "Description" --pain "Pain points" --angle "Optional positioning"');
    return;
  }

  console.log('🚀 Generating creatives for:', clientName);
  console.log('⏳ This takes 30-60 seconds...\n');

  // Load knowledge base content
  const knowledgeBase = readKnowledgeBase();

  // Build prompt for Claude
  const prompt = `You are an expert life insurance copywriter who creates high-converting ad scripts based on proven patterns.

${knowledgeBase}

---

CLIENT INFO:
- Name: ${clientName}
- Product: ${product}
- Target Audience: ${audience}
- Pain Points: ${pain}
- Unique Angle: ${angle}

---

CRITICAL SCRIPT REQUIREMENTS:
- NO first-person references ("I'm a professional", "I helped", "my clients", "I've seen")
- Focus on THEM (the viewer) and their emotional pain
- Scripts feel like breaking news exposé or insider leak, NOT sales pitch
- Social proof = anonymous relatable people ("Business owners like you"), NOT "my clients"
- Remove ALL credential-flexing - the message creates authority, not titles
- Pure emotion, urgency, benefits - make them FEEL something and WANT to click
- Conspiracy angle should be about THEM vs big companies, not about you as the messenger
- Use patterns from the WINNING SCRIPTS KNOWLEDGE above

---

TASK:
Generate a complete creative package with 5 image prompts and 3 HeyGen video prompts (each with full embedded scripts).

---

# OUTPUT FORMAT:

## PART 1: NANO BANANA PRO / HIGGSFIELD - AVATAR PHOTOS

**IMPORTANT WORKFLOW INSTRUCTIONS:**
1. Generate Photo 1 in Nano Banana using the full prompt below
2. Save Photo 1 as "avatar-photo-1.jpg"
3. For Photos 2-5: Upload "avatar-photo-1.jpg" as reference image in Higgsfield
4. Then use each shortened prompt (Higgsfield will keep the character consistent)

---

### PHOTO 1 - BASE CHARACTER (Full Detailed Prompt)

Analyze the target audience "${audience}" and create a character that authentically represents them.

For ${product} targeting ${audience}:
- Determine appropriate age, gender, ethnicity, occupation indicators
- Choose clothing that matches their lifestyle (not generic business attire unless they're business owners)
- Select background setting where this audience naturally spends time
- Match expression to product type (${product})

Now generate the actual Photo 1 prompt:

Selfie-style photo of [WRITE THE ACTUAL CHARACTER: age, gender, appearance, specific clothing items, facial features, expression], looking directly into camera with [specific expression]. Background is [WRITE THE ACTUAL SETTING: specific location that matches ${audience} lifestyle], softly blurred. Shot from chest up, [describe specific lighting that matches setting], slight wide-angle phone camera perspective. Hyper-realistic portrait photography style, 9:16 vertical format

---

### PHOTO 2 - Left Turn (Upload Photo 1 as Reference in Higgsfield)

**Higgsfield Instructions:** Upload avatar-photo-1.jpg as reference image, then paste this prompt:

[Extract ONLY the key identifiers from Photo 1 prompt: age, key appearance traits, clothing], head turned slightly to the left, 3/4 profile angle, looking just off-camera, [same expression type as Photo 1], [same background as Photo 1], natural lighting, selfie-style phone photo, chest-up framing, hyper-realistic photography, 9:16 vertical

---

### PHOTO 3 - Right Turn (Upload Photo 1 as Reference)

[Same shortened character from Photo 2], head turned slightly to the right, 3/4 profile angle, subtle confident expression, [same background], natural lighting, selfie-style phone photo, chest-up framing, hyper-realistic photography, 9:16 vertical

---

### PHOTO 4 - Neutral Expression (Upload Photo 1 as Reference)

[Same shortened character], direct front view, neutral professional expression, [same background], natural lighting, selfie-style phone photo, chest-up framing, hyper-realistic photography, 9:16 vertical

---

### PHOTO 5 - Speaking Pose (Upload Photo 1 as Reference)

[Same shortened character], direct front view, mouth slightly open as if mid-speech, engaged expression, [same background], natural lighting, selfie-style phone photo, chest-up framing, hyper-realistic photography, 9:16 vertical

---

## PART 2: HEYGEN VIDEO PROMPTS (3 SCRIPTS)

### MEMORY SETUP (Paste once into HeyGen Memory — saves forever)

**Video delivery style:**
"Direct-to-camera podcast style with urgent, emotional delivery. Speaker maintains strong eye contact and speaks like they're revealing insider information that could change the viewer's life. NO sales pitch energy. Pure urgency and emotion. Tone feels like exposing a conspiracy or breaking major news."

**Target audience and niche:**
"Life insurance marketing ads for ${audience}. ${product === 'Final Expense' ? 'Emotional family-focused messaging that removes fear and creates urgency around protecting loved ones.' : product === 'IUL' ? 'Urgent tax-focused messaging for high earners frustrated with overpaying. Speak to their pain and anger about being robbed by the IRS.' : 'Urgent protective messaging for young families worried about leaving their kids unprotected.'} Every word should make them FEEL something."

**Music preference:**
"Dramatic background music with building tension. Opening should feel urgent like breaking news. Build intensity during problem/agitation. Confident during solution. Music should amplify emotion without overpowering voice."

**Caption style preference:**
"Bold pop-style captions with breaking news aesthetic placed in upper third of frame (never lower third). Text large and prominent — impossible to miss on mobile. Red banners for shocking numbers and deadlines. Yellow warnings for urgency. Green/pink highlights for trust-building phrases. Every caption should amplify emotion and create urgency."

---

CRITICAL INSTRUCTIONS FOR ALL 3 HEYGEN PROMPTS:
- Each prompt must use a DIFFERENT framework from WINNING_SCRIPTS (HSO, PPPP, QUEST, Testimonial-First, SLAP, Villain, Curiosity Gap, SIC, or Breaking News/Conspiracy)
- Each prompt must use a DIFFERENT hook style
- BEFORE writing each prompt, declare: Framework: [name] | Hook Style: [name]
- NO first-person language in any script
- All captions go in upper third of frame, text large and bold
- B-roll clips: 1-3 seconds each (punchy cuts, not slow stock footage)
- 9:16 layout: bottom half = speaker, top half = B-roll clips (split-screen preferred)
- Full-screen B-roll: 2-3 seconds max, then cut back to speaker
- Emotional arc per script: pain → hope → urgency
- Product name appears in Solution section only (not hook/agitation/social proof)

---

### HEYGEN PROMPT #1 — [Script 1 Title Based on Framework]

**Framework:** [Name the framework used — must differ from Prompts 2 and 3]
**Hook Style:** [Name the hook style used — must differ from Prompts 2 and 3]
**Duration:** 60 seconds
**Layout:** Portrait (9:16) — split-screen (speaker bottom, B-roll top)
**Avatar:** [User selects from Nano Banana photos above]
**Color scheme:** ${product === 'Final Expense' ? 'Red/warm tones (urgency + comfort)' : product === 'IUL' ? 'Yellow/blue/earth tones (professional financial)' : 'Blue/green/warm tones (protection + family)'}

---

**FULL SCRIPT + SCENE BREAKDOWN:**

**Scene 1 (0-5s | Hook):**
B-roll (top half, 1-3s clips): [Audience-specific B-roll matching this script's hook angle]
VO: [Full hook — specific to this framework. NO first-person. NO product name. Pure emotional pain or curiosity. Use patterns from WINNING_SCRIPTS Hook Style Library.]
Caption (upper third, bold): [Opening caption — ⚠️ style or shocking statement]

**Scene 2 (5-15s | Agitation):**
Visual: Speaker direct to camera (bottom half), relevant B-roll above (1-3s clips)
VO: [Full agitation — amplify ${pain} with immediate deadline. "tonight", "today", "soon". NO specific future dates. NO product mentions.]
Caption (upper third): [RED BANNER — shocking stat or deadline relevant to this script's angle]

**Scene 3 (15-30s | Social Proof):**
B-roll (top half): ${audience} experiencing relief/success (1-3s cuts)
VO: [Full social proof — use a different structure than Prompts 2 and 3. Options: location-based ("A welder in Ohio said..."), anonymous group ("${audience} across the country thought this was fake..."), or first-person testimonial style ("'I didn't believe it either, but I qualified in 60 seconds'"). Match this script's framework.]
Caption overlays (upper third, text bubble style): [2-3 relatable quotes from the social proof]

**Scene 4 (30-45s | Solution):**
Visual: Speaker on camera, confident
VO: [Full solution — introduce product by name here. Focus on THEIR benefits solving ${pain}. Concrete numbers. Compliance-approved language only. Lead with wealth-building for IUL, death benefit for Final Expense.]
Motion Graphics: [3-4 animated benefit bullets specific to this script's angle]
Caption (upper third): [Product name + key dollar amount]

**Scene 5 (45-55s | Authority):**
Visual: Speaker, urgent expression
VO: [Full authority section — "Why haven't you heard?" or equivalent for this framework. Villain = big companies HIDING this, not selling cheap alternatives. Make it us vs them.]
Caption (upper third, yellow warning): [Authority caption — e.g., "WHY HAVEN'T YOU HEARD?"]

**Scene 6 (55-60s | CTA):**
Visual: Speaker pointing at camera or end card with pulsing button + downward arrow
VO: [Full CTA — friction-free. Choose from: "Click below. Two questions. No calls, no spam." OR a CTA variant from WINNING_SCRIPTS Alternative CTAs section. Add immediate urgency ("tonight", "before rates change").]
Motion Graphics: Pulsing arrow pointing down
Caption (upper third): "CLICK BELOW ↓"

**Pacing:** Speed 1.1x | Pauses: 0.3s after hook, 0.5s before CTA
**Tone:** Urgent insider revealing suppressed information — frustration → hope → urgency

---

### HEYGEN PROMPT #2 — [Script 2 Title Based on Framework]

**Framework:** [DIFFERENT framework from Prompt 1 — must be a different structural approach]
**Hook Style:** [DIFFERENT hook style from Prompt 1]
**Duration:** 60 seconds
**Layout:** Portrait (9:16) — split-screen (speaker bottom, B-roll top)
**Avatar:** [User selects from Nano Banana photos above]
**Color scheme:** ${product === 'Final Expense' ? 'Red/warm tones (urgency + comfort)' : product === 'IUL' ? 'Yellow/blue/earth tones (professional financial)' : 'Blue/green/warm tones (protection + family)'}

---

**FULL SCRIPT + SCENE BREAKDOWN:**

[Generate full scene-by-scene breakdown identical in structure to Prompt #1 but using the different framework and hook style declared above. Script content must be meaningfully different — different angle, different emotional trigger, different flow. Not a variation of Prompt 1 with swapped words.]

---

### HEYGEN PROMPT #3 — [Script 3 Title Based on Framework]

**Framework:** [DIFFERENT framework from Prompts 1 and 2]
**Hook Style:** [DIFFERENT hook style from Prompts 1 and 2]
**Duration:** 60 seconds
**Layout:** Portrait (9:16) — split-screen (speaker bottom, B-roll top)
**Avatar:** [User selects from Nano Banana photos above]
**Color scheme:** ${product === 'Final Expense' ? 'Red/warm tones (urgency + comfort)' : product === 'IUL' ? 'Yellow/blue/earth tones (professional financial)' : 'Blue/green/warm tones (protection + family)'}

---

**FULL SCRIPT + SCENE BREAKDOWN:**

[Generate full scene-by-scene breakdown identical in structure to Prompt #1 but using the different framework and hook style declared above. Script content must be meaningfully different — different angle, different emotional trigger, different flow. Not a variation of Prompts 1 or 2.]

---

## CAPTION EMPHASIS GUIDE (applies to all 3 prompts):

**Placement:** Upper third of frame ONLY — never lower third, never center
**Size:** Large, bold — bigger than feels comfortable — impossible to miss on mobile
**RED BANNERS:** Dollar amounts, deadlines, shocking stats, warnings
**YELLOW WARNINGS:** ⚠️ symbols, breaking news, time sensitivity
**GREEN/PINK HIGHLIGHTS:** Trust phrases, friction removers, social proof
**WHITE/BOLD:** Product name, benefits, CTA

---

Generate all content now. Apply ALL rules from WINNING_SCRIPTS, LESSONS LEARNED, VISUAL_STYLE_GUIDE, and COMPLIANCE knowledge above.

Before generating each HeyGen prompt, confirm:
- [ ] Framework named and different from the other 2
- [ ] Hook style named and different from the other 2
- [ ] Social proof structure different across all 3
- [ ] Zero first-person language
- [ ] Product name only in Solution section
- [ ] All captions upper third, large/bold
- [ ] B-roll: 1-3s clips, split-screen layout
- [ ] Emotional arc: pain → hope → urgency`;

  try {
    // Call Claude API
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract response
    const content = message.content[0].text;

    // Create client folder
    const clientFolder = clientName.toLowerCase().replace(/\s+/g, '-');
    const outputDir = path.join(__dirname, 'output', clientFolder);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save all content to one file
    const outputFile = path.join(outputDir, 'creatives.md');
    fs.writeFileSync(outputFile, content);

    console.log('✅ Creatives generated successfully!\n');
    console.log('📁 Saved to:', outputFile);
    console.log('\n📝 Open the file to see:');
    console.log('   • 5 image prompts (Nano Banana base + Higgsfield variants)');
    console.log('   • 3 HeyGen prompts — each with full embedded script, scene breakdown, and captions');
    console.log('\n🎬 Workflow:');
    console.log('   1. Use Nano Banana prompts → generate avatar photos');
    console.log('   2. Copy HeyGen Prompt #1, #2, or #3 → paste directly into HeyGen');
    console.log('   3. Each prompt is self-contained — scripts are embedded inside\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run it
generateCreatives();