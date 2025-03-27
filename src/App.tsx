import { useEffect, useState, useRef, FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  name: string;
};

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<{ enabled: boolean; id: string }>({
    enabled: false,
    id: '',
  });
  const [darkMode, setDarkMode] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem("@cursoreact");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (err) {
        console.error("Erro ao carregar tasks:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("@cursoreact", JSON.stringify(tasks));
  }, [tasks]);

  function handleRegister() {
    const trimmed = input.trim();
    if (!trimmed) return alert("Preencha o nome da tarefa!");

    if (editTask.enabled) {
      handleSaveEdit(trimmed);
    } else {
      const newTask: Task = { id: uuidv4(), name: trimmed };
      setTasks(prev => [...prev, newTask]);
      setInput("");
    }
  }

  function handleSaveEdit(newName: string) {
    setTasks(prev =>
      prev.map(task =>
        task.id === editTask.id ? { ...task, name: newName } : task
      )
    );
    setEditTask({ enabled: false, id: '' });
    setInput("");
  }

  function handleDelete(id: string) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function handleEdit(task: Task) {
    inputRef.current?.focus();
    setInput(task.name);
    setEditTask({ enabled: true, id: task.id });
  }

  const theme = darkMode ? dark : light;

  return (
    <div style={{ ...styles.body, backgroundColor: theme.bg, color: theme.text }}>
      <main style={{ ...styles.container, backgroundColor: theme.card }}>
        <h1 style={{ ...styles.title, color: theme.text }}>📝 Lista de Tarefas</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            ...styles.toggleButton,
            backgroundColor: theme.primary,
            color: darkMode ? '#000' : '#fff'
          }}
          aria-label="Alternar tema"
        >
          {darkMode ? '☀️ Claro' : '🌙 Escuro'}
        </button>

        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            handleRegister();
          }}
          style={styles.form}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Estudar React..."
            aria-label="Digite o nome da tarefa"
            style={{
              ...styles.input,
              backgroundColor: theme.inputBg,
              color: theme.text,
              borderColor: theme.border
            }}
          />
          <button
            type="submit"
            aria-label="Adicionar tarefa"
            onMouseEnter={() => setHoveredButton("add")}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...styles.button,
              backgroundColor: hoveredButton === "add" ? theme.primaryHover : theme.primary
            }}
          >
            {editTask.enabled ? "Atualizar" : "Adicionar"}
          </button>
        </form>

        <strong>Você tem {tasks.length} tarefa(s)</strong>

        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.map(task => (
            <article
              key={task.id}
              style={{
                ...styles.taskCard,
                backgroundColor: theme.card,
                borderColor: theme.border,
              }}
              role="group"
              aria-label={`Tarefa: ${task.name}`}
            >
              <span style={{ color: theme.text }}>{task.name}</span>
              <div style={styles.actions}>
                <button
                  type="button"
                  onClick={() => handleEdit(task)}
                  aria-label={`Editar tarefa: ${task.name}`}
                  onMouseEnter={() => setHoveredButton(task.id + "edit")}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    ...styles.smallBtn,
                    backgroundColor: hoveredButton === task.id + "edit" ? theme.editHover : theme.edit
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  aria-label={`Excluir tarefa: ${task.name}`}
                  onMouseEnter={() => setHoveredButton(task.id + "delete")}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    ...styles.smallBtn,
                    backgroundColor: hoveredButton === task.id + "delete" ? theme.deleteHover : theme.delete
                  }}
                >
                  🗑️ Excluir
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

const light = {
  bg: "#f9f9f9",
  card: "#ffffff",
  text: "#1e1e1e",
  primary: "#0077b6",
  primaryHover: "#005f87",
  inputBg: "#fff",
  border: "#ccc",
  edit: "#ffb703",
  editHover: "#e6a700",
  delete: "#e63946",
  deleteHover: "#c0303c",
};

const dark = {
  bg: "#121212",
  card: "#1f1f1f",
  text: "#ffffff",
  primary: "#90e0ef",
  primaryHover: "#62c8de",
  inputBg: "#2a2a2a",
  border: "#444",
  edit: "#ffc857",
  editHover: "#e6b845",
  delete: "#ef476f",
  deleteHover: "#d03b5f",
};

const styles = {
  body: {
    minHeight: "100vh",
    transition: "all 0.3s ease",
  },
  container: {
    maxWidth: 500,
    margin: "0 auto",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    textAlign: "center" as const,
    marginBottom: 24,
    color: "#fff"
  },
  toggleButton: {
    marginBottom: 16,
    padding: "6px 12px",
    fontSize: 14,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
  },
  form: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid",
  },
  button: {
    padding: "10px 16px",
    fontSize: 16,
    color: "#fff",
    fontWeight: 500,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  taskCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    border: "1px solid",
    borderRadius: 10,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  smallBtn: {
    padding: "6px 10px",
    fontSize: 16,
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};
