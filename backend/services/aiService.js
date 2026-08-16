const https = require('https');
const http = require('http');

/**
 * Service handling Featherless.ai / OpenAI-compatible API inference pipelines
 */
class AIService {
  constructor() {
    this.apiKey = process.env.FEATHERLESS_API_KEY || '';
    this.baseUrl = process.env.FEATHERLESS_BASE_URL || 'https://api.featherless.ai/v1';
    this.model = process.env.FEATHERLESS_MODEL || 'meta-llama/Meta-Llama-3.1-8B-Instruct';
  }

  /**
   * Decomposes a high-level user goal into structured milestones, tasks, and cognitive analysis
   */
  async decomposeGoal(goalTitle, goalDescription) {
    const prompt = `You are FlowState AI, an elite productivity architect. Decompose the following project goal into structured milestones and detailed sub-tasks.
Project Title: "${goalTitle}"
Project Description: "${goalDescription}"

Respond ONLY with valid JSON matching this exact structure:
{
  "summary": "Brief 2-sentence strategy summary for completing this project.",
  "complexityScore": 7,
  "cognitiveLoadScore": 6,
  "suggestedPhases": ["Phase 1: Foundation", "Phase 2: Execution", "Phase 3: Launch"],
  "tasks": [
    {
      "title": "Specific Task Title",
      "description": "Concrete action step required.",
      "milestone": "Phase 1: Foundation",
      "priority": "High",
      "estimatedMinutes": 45,
      "aiBriefing": {
        "contextSummary": "Key objective context for this task.",
        "keyDeliverables": ["Deliverable 1", "Deliverable 2"],
        "suggestedTools": ["Tool A", "Tool B"],
        "potentialPitfalls": ["Common obstacle to avoid"]
      }
    }
  ]
}`;

    if (this.apiKey && this.apiKey !== 'your_featherless_api_key_here') {
      try {
        const responseText = await this._callFeatherlessAPI(prompt);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn(`[AI Service] Featherless API call skipped or failed (${err.message}). Using cognitive heuristic engine.`);
      }
    }

    // Fallback: Advanced Heuristic Inference Pipeline (Original Logic)
    return this._generateHeuristicDecomposition(goalTitle, goalDescription);
  }

  /**
   * Generates a context briefing for a single task when needed
   */
  async generateTaskBriefing(taskTitle, taskDescription) {
    return {
      contextSummary: `High-focus execution framework for "${taskTitle}". Ensure prerequisites are met before beginning.`,
      keyDeliverables: [
        `Complete draft/implementation of ${taskTitle}`,
        `Verify output against specifications`
      ],
      suggestedTools: ['VSCode / Workspace', 'Markdown Notes', 'FlowState Focus Timer'],
      potentialPitfalls: [
        'Getting distracted by sub-problems; maintain focus strictly on the current task scope.',
        'Over-engineering initial implementation.'
      ]
    };
  }

  /**
   * Helper to execute raw HTTP/HTTPS call to Featherless.ai / OpenAI compatible endpoint
   */
  _callFeatherlessAPI(prompt) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}/chat/completions`);
      const payload = JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a JSON-only productivity assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const requester = url.protocol === 'https:' ? https : http;
      const req = requester.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(body);
              resolve(data.choices[0].message.content);
            } catch (e) {
              reject(new Error('Failed to parse AI JSON response body'));
            }
          } else {
            reject(new Error(`API responded with status code ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.setTimeout(8000, () => {
        req.destroy();
        reject(new Error('Featherless API request timed out'));
      });
      req.write(payload);
      req.end();
    });
  }

  /**
   * Algorithmic cognitive decomposition (serves as smart offline inference pipeline)
   */
  _generateHeuristicDecomposition(title, description) {
    const isTech = /code|app|website|build|api|database|full-stack|mern|system/i.test(title + ' ' + description);
    const isDesign = /design|ui|ux|mockup|brand|logo|figma/i.test(title + ' ' + description);

    let phases = [];
    let tasks = [];

    if (isTech) {
      phases = ['Phase 1: Architecture & Setup', 'Phase 2: Core Development', 'Phase 3: Integration & Testing', 'Phase 4: Deployment & Polish'];
      tasks = [
        {
          title: 'Define System Schema & Data Models',
          description: 'Establish database tables/documents, relations, and core API contract definitions.',
          milestone: 'Phase 1: Architecture & Setup',
          priority: 'High',
          estimatedMinutes: 45,
          aiBriefing: {
            contextSummary: 'Ensure all data types, mandatory fields, and indexing rules are clear before writing code.',
            keyDeliverables: ['Schema diagram', 'Mongoose / ORM model files'],
            suggestedTools: ['MongoDB Compass', 'Mongoose Docs', 'Postman'],
            potentialPitfalls: ['Forgetting index optimizations on heavily queried fields.']
          }
        },
        {
          title: 'Implement Core API Endpoints & Business Logic',
          description: 'Develop controller functions, business services, and error-handling middleware.',
          milestone: 'Phase 2: Core Development',
          priority: 'High',
          estimatedMinutes: 60,
          aiBriefing: {
            contextSummary: 'Focus on clean separation of concerns and robust error propagation.',
            keyDeliverables: ['REST API routes', 'Middleware pipeline'],
            suggestedTools: ['Express.js', 'Node.js', 'Morgan Logging'],
            potentialPitfalls: ['Swallowing errors without proper HTTP status codes.']
          }
        },
        {
          title: 'Build Dynamic UI Components & Visual Polish',
          description: 'Create reactive frontend components with smooth state management and custom CSS styling.',
          milestone: 'Phase 2: Core Development',
          priority: 'Medium',
          estimatedMinutes: 60,
          aiBriefing: {
            contextSummary: 'Craft visual hierarchy using CSS variables, flex/grid layouts, and micro-interactions.',
            keyDeliverables: ['Responsive views', 'Interactive state hooks'],
            suggestedTools: ['Vite', 'React', 'CSS Modules'],
            potentialPitfalls: ['Hardcoding layout math instead of using responsive CSS flex/grid.']
          }
        },
        {
          title: 'End-to-End Compute Integration & Edge-Case Verification',
          description: 'Connect third-party API inferences, test error states, and run manual walkthrough.',
          milestone: 'Phase 3: Integration & Testing',
          priority: 'High',
          estimatedMinutes: 40,
          aiBriefing: {
            contextSummary: 'Validate that API failures fall back gracefully without breaking the user workspace.',
            keyDeliverables: ['Tested integration pipeline', 'Clean error logs'],
            suggestedTools: ['Browser DevTools', 'Network Tab'],
            potentialPitfalls: ['Unhandled async rejections crashing the Node process.']
          }
        }
      ];
    } else if (isDesign) {
      phases = ['Phase 1: Research & Discovery', 'Phase 2: Wireframing & Layout', 'Phase 3: Visual Polish'];
      tasks = [
        {
          title: 'Conduct Competitor & User Journey Analysis',
          description: 'Gather inspirational UI references and document target audience workflows.',
          milestone: 'Phase 1: Research & Discovery',
          priority: 'High',
          estimatedMinutes: 30,
          aiBriefing: {
            contextSummary: 'Identify user pain points and define 3 visual moodboard directions.',
            keyDeliverables: ['Moodboard', 'User flow map'],
            suggestedTools: ['Figma', 'Dribbble', 'Pinterest'],
            potentialPitfalls: ['Getting lost in visual reference rabbit holes.']
          }
        },
        {
          title: 'Draft Low-Fidelity Layouts & Component Tokens',
          description: 'Establish typography scale, color palette (HSL), and spacing variables.',
          milestone: 'Phase 2: Wireframing & Layout',
          priority: 'Medium',
          estimatedMinutes: 45,
          aiBriefing: {
            contextSummary: 'Ensure high contrast ratios (WCAG AA compliant) for readability.',
            keyDeliverables: ['Design system tokens', 'Component wireframes'],
            suggestedTools: ['Figma Tokens', 'Color Contrast Checker'],
            potentialPitfalls: ['Inconsistent spacing scales across components.']
          }
        }
      ];
    } else {
      phases = ['Phase 1: Planning', 'Phase 2: Execution', 'Phase 3: Review'];
      tasks = [
        {
          title: `Analyze Scope for "${title}"`,
          description: `Define key deliverables and milestone objectives for ${title}.`,
          milestone: 'Phase 1: Planning',
          priority: 'High',
          estimatedMinutes: 30,
          aiBriefing: {
            contextSummary: 'Break down overarching objectives into 1-hour actionable blocks.',
            keyDeliverables: ['Project outline', 'Resource checklist'],
            suggestedTools: ['FlowState Workspace'],
            potentialPitfalls: ['Scope creep.']
          }
        },
        {
          title: 'Execute Core Sprint',
          description: 'Focus on primary deliverables with zero context switching.',
          milestone: 'Phase 2: Execution',
          priority: 'High',
          estimatedMinutes: 60,
          aiBriefing: {
            contextSummary: 'Enter Focus Mode to maintain cognitive momentum.',
            keyDeliverables: ['Completed project draft'],
            suggestedTools: ['FlowState Focus Timer'],
            potentialPitfalls: ['Multitasking between unrelated activities.']
          }
        }
      ];
    }

    return {
      summary: `AI Decomposition for "${title}": Deconstructed into ${phases.length} distinct phases and ${tasks.length} actionable tasks with cognitive briefings.`,
      complexityScore: isTech ? 8 : 6,
      cognitiveLoadScore: isTech ? 7 : 5,
      suggestedPhases: phases,
      tasks: tasks
    };
  }
}

module.exports = new AIService();
