/**
 * Configuration for "Ask Verdant" — the conversational surface.
 *
 * Kept out of the component so the prompt library, labels and disclaimers can be
 * reviewed as content rather than hunted for in JSX.
 */

export const assistant = {
  eyebrow: 'Ask Verdant',
  title: 'Ask a question. Check the sources behind the answer.',
  body: 'Ask about sustainability, climate action, responsible consumption, energy, water, waste, biodiversity or sustainable communities. Answers are retrieved from a curated knowledge base — and every one of them arrives with the documents it came from.',
  placeholder: 'Ask about energy, water, waste, transport, biodiversity or climate action…',
  sendLabel: 'Send',
  clearLabel: 'Start over',

  welcome: {
    title: 'What would you like to understand?',
    body: 'I answer from a fixed set of sustainability sources. If something is not covered there, I will tell you rather than improvise.'
  },

  suggested: [
    'What can I do to reduce waste?',
    'How can our campus save water?',
    'What are practical ways to reduce my carbon footprint?',
    'How can communities prepare for climate risks?',
    'What is SDG 13?'
  ],

  labels: {
    you: 'You',
    assistant: 'Verdant',
    sources: 'Sources',
    actions: 'Recommended actions',
    thinking: 'Reading the sources…'
  },

  errors: {
    offline:
      'The assistant could not reach the Verdant API. Start the backend with "uvicorn app.main:app --reload --port 8000" and try again.',
    empty: 'Please write a question first.'
  },

  /**
   * Shown under the composer. This is deliberately stated in the interface
   * rather than buried in a policy page — a reader should know what they are
   * talking to before they trust it.
   */
  limits:
    'Answers are grounded in Verdant\u2019s sources and labelled as guidance. Nothing you type is stored on the server.',
  privacyNote: 'History stays in this browser tab and is discarded when you close it.'
}
