import { useMemo, useState } from "react";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
};

type ProviderConfig = {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  enabled: boolean;
};

type AgentCard = {
  id: string;
  name: string;
  description: string;
  primaryModel: string;
  skills: string;
  contact: string;
  enabled: boolean;
};

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "agent",
    content:
      "Welcome to Dexter Web. Ask a financial research question, manage providers, or configure A2A agent cards.",
  },
];

const initialProviders: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com",
    apiKey: "",
    enabled: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com",
    apiKey: "",
    enabled: false,
  },
  {
    id: "google",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com",
    apiKey: "",
    enabled: false,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api",
    apiKey: "",
    enabled: false,
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    baseUrl: "http://127.0.0.1:11434",
    apiKey: "",
    enabled: false,
  },
];

const initialAgentCards: AgentCard[] = [
  {
    id: "a2a-1",
    name: "Dexter Research Lead",
    description: "Coordinates deep financial research and tool orchestration.",
    primaryModel: "gpt-5.2",
    skills: "Financial search, SEC filings, valuation summaries",
    contact: "agent://dexter/lead",
    enabled: true,
  },
  {
    id: "a2a-2",
    name: "Market Pulse Scout",
    description: "Tracks catalysts, earnings moves, and market sentiment.",
    primaryModel: "claude-3.5-sonnet",
    skills: "Web search, sentiment tagging, event briefs",
    contact: "agent://dexter/market",
    enabled: false,
  },
];

const createId = () => `id-${Math.random().toString(36).slice(2, 10)}`;

const App = () => {
  const [activeView, setActiveView] = useState<"chat" | "admin">("chat");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [providers, setProviders] = useState<ProviderConfig[]>(initialProviders);
  const [agentCards, setAgentCards] = useState<AgentCard[]>(initialAgentCards);
  const [showKeys, setShowKeys] = useState(false);

  const messageCount = useMemo(() => messages.length, [messages]);

  const handleSend = () => {
    if (!draft.trim()) return;
    const userMessage: Message = {
      id: createId(),
      role: "user",
      content: draft.trim(),
    };
    const agentMessage: Message = {
      id: createId(),
      role: "agent",
      content:
        "Message queued. This web UI is ready to connect to the agent runtime.",
    };
    setMessages((prev) => [...prev, userMessage, agentMessage]);
    setDraft("");
  };

  const updateProvider = (id: string, updates: Partial<ProviderConfig>) => {
    setProviders((prev) =>
      prev.map((provider) =>
        provider.id === id ? { ...provider, ...updates } : provider,
      ),
    );
  };

  const updateAgentCard = (id: string, updates: Partial<AgentCard>) => {
    setAgentCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    );
  };

  const addAgentCard = () => {
    setAgentCards((prev) => [
      ...prev,
      {
        id: createId(),
        name: "New Agent",
        description: "Describe this agent card.",
        primaryModel: "gpt-5.2",
        skills: "",
        contact: "agent://dexter/new",
        enabled: false,
      },
    ]);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__title">Dexter</span>
          <span className="brand__subtitle">Web Console</span>
        </div>
        <nav className="nav">
          <button
            type="button"
            className={activeView === "chat" ? "nav__link active" : "nav__link"}
            onClick={() => setActiveView("chat")}
          >
            Conversations
          </button>
          <button
            type="button"
            className={activeView === "admin" ? "nav__link active" : "nav__link"}
            onClick={() => setActiveView("admin")}
          >
            Admin
          </button>
        </nav>
        <div className="sidebar__footer">
          <div className="status">
            <span className="status__dot" />
            {messageCount} messages
          </div>
        </div>
      </aside>

      <main className="content">
        {activeView === "chat" ? (
          <section className="panel">
            <header className="panel__header">
              <div>
                <h1>Research Console</h1>
                <p>Guide the agent and review tool-ready responses.</p>
              </div>
              <div className="panel__actions">
                <button type="button" className="button button--ghost">
                  New thread
                </button>
              </div>
            </header>
            <div className="chat">
              <div className="chat__messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat__message chat__message--${message.role}`}
                  >
                    <div className="chat__role">
                      {message.role === "user" ? "You" : "Dexter"}
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))}
              </div>
              <div className="chat__input">
                <textarea
                  placeholder="Ask a question about a company, market, or filing..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                />
                <div className="chat__controls">
                  <div className="chat__hint">
                    Press send to enqueue a request for the agent.
                  </div>
                  <button type="button" className="button" onClick={handleSend}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="panel">
            <header className="panel__header">
              <div>
                <h1>Admin Control Center</h1>
                <p>Manage provider credentials and A2A agent cards.</p>
              </div>
              <div className="panel__actions">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setShowKeys((prev) => !prev)}
                >
                  {showKeys ? "Hide keys" : "Show keys"}
                </button>
              </div>
            </header>

            <div className="admin-grid">
              <div className="card">
                <div className="card__header">
                  <h2>LLM Providers</h2>
                  <p>Toggle providers and store API credentials.</p>
                </div>
                <div className="stack">
                  {providers.map((provider) => (
                    <div key={provider.id} className="provider">
                      <div className="provider__row">
                        <div>
                          <h3>{provider.name}</h3>
                          <p className="muted">{provider.baseUrl}</p>
                        </div>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={provider.enabled}
                            onChange={(event) =>
                              updateProvider(provider.id, {
                                enabled: event.target.checked,
                              })
                            }
                          />
                          <span>Enabled</span>
                        </label>
                      </div>
                      <div className="provider__fields">
                        <label>
                          Base URL
                          <input
                            value={provider.baseUrl}
                            onChange={(event) =>
                              updateProvider(provider.id, {
                                baseUrl: event.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          API Key
                          <input
                            type={showKeys ? "text" : "password"}
                            value={provider.apiKey}
                            onChange={(event) =>
                              updateProvider(provider.id, {
                                apiKey: event.target.value,
                              })
                            }
                            placeholder="sk-..."
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card__header card__header--split">
                  <div>
                    <h2>A2A Agent Cards</h2>
                    <p>Editable cards for agent-to-agent coordination.</p>
                  </div>
                  <button type="button" className="button" onClick={addAgentCard}>
                    Add card
                  </button>
                </div>
                <div className="card-grid">
                  {agentCards.map((card) => (
                    <div key={card.id} className="agent-card">
                      <div className="agent-card__header">
                        <h3>{card.name}</h3>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={card.enabled}
                            onChange={(event) =>
                              updateAgentCard(card.id, {
                                enabled: event.target.checked,
                              })
                            }
                          />
                          <span>Live</span>
                        </label>
                      </div>
                      <label>
                        Name
                        <input
                          value={card.name}
                          onChange={(event) =>
                            updateAgentCard(card.id, { name: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        Description
                        <textarea
                          rows={3}
                          value={card.description}
                          onChange={(event) =>
                            updateAgentCard(card.id, {
                              description: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Primary model
                        <input
                          value={card.primaryModel}
                          onChange={(event) =>
                            updateAgentCard(card.id, {
                              primaryModel: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Skills
                        <input
                          value={card.skills}
                          onChange={(event) =>
                            updateAgentCard(card.id, {
                              skills: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Contact URI
                        <input
                          value={card.contact}
                          onChange={(event) =>
                            updateAgentCard(card.id, {
                              contact: event.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
