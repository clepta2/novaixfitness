// src/data/exercises.ts
// Tutoriais detalhados de exercícios - NOVAIX FITNESS

interface Step {
  step: number;
  title: string;
  text: string;
  image: string;
}

interface DetailedExercise {
  steps: Step[];
  tips: string[];
  mistakes: string[];
}

export const DETAILED_EXERCISES: Record<string, DetailedExercise> = {
  push_up: {
    steps: [
      {
        step: 1,
        title: "Alinhamento",
        text: "Mãos um pouco mais largas que os ombros, apontando para a frente. Corpo reto formando uma prancha rígida dos calcanhares à cabeça. Contraia abdômen e glúteos.",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 2,
        title: "Descida Controlada",
        text: "Dobre os cotovelos e desça o corpo inteiro de forma uniforme. Não deixe apenas o peito cair. Inspire profundamente durante a descida controlada.",
        image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 3,
        title: "Ângulo Seguro",
        text: "Mantenha os cotovelos apontados para trás a 45° (formato de flecha, não de 'T'). Desça até que o peito fique a poucos centímetros do chão, pescoço neutro.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 4,
        title: "Subida Explosiva",
        text: "Empurre o chão com força total, estendendo os braços e expirando. Mantenha o abdômen travado para que quadril e ombros subam sincronizados.",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=60"
      }
    ],
    tips: [
      "Se estiver difícil, faça com joelhos apoiados ou com as mãos elevadas em um banco/parede.",
      "Mantenha o core rígido o tempo todo para proteger a lombar de hiperextensão.",
      "Mantenha os ombros encaixados para trás e para baixo (depressão e retração)."
    ],
    mistakes: [
      "Abrir os cotovelos em 90° (formato T), o que sobrecarrega severamente os ombros.",
      "Deixar o quadril cair em direção ao chão (lombar desabada).",
      "Olhar para baixo flexionando o pescoço, o que desalinha a coluna cervical."
    ]
  },
  squat: {
    steps: [
      {
        step: 1,
        title: "Base Inicial",
        text: "Fique em pé, pés na largura dos ombros e levemente apontados para fora. Core ativado e peito aberto.",
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 2,
        title: "Movimento de Sentar",
        text: "Inicie dobrando os joelhos e empurrando o quadril para trás, como se fosse sentar em uma cadeira. Inspire.",
        image: "https://images.unsplash.com/photo-1574680131990-6745ec6c4157?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 3,
        title: "Profundidade",
        text: "Desça até que suas coxas fiquem pelo menos paralelas ao chão, mantendo a coluna neutra e o peso nos calcanhares.",
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 4,
        title: "Retorno",
        text: "Empurre a partir do meio do pé e calcanhares para retornar à posição ereta. Expire no final do movimento.",
        image: "https://images.unsplash.com/photo-1574680131990-6745ec6c4157?w=600&auto=format&fit=crop&q=60"
      }
    ],
    tips: [
      "Mantenha os joelhos alinhados com a ponta dos pés o tempo todo.",
      "Mantenha o peito elevado para evitar que o tronco incline demais para a frente.",
      "Mantenha os pés totalmente planos no chão."
    ],
    mistakes: [
      "Valgo dinâmico: deixar os joelhos caírem para dentro durante a descida ou subida.",
      "Retroversão pélvica excessiva ('butt wink') no final do movimento.",
      "Tirar os calcanhares do chão, jogando toda a carga nos joelhos."
    ]
  },
  bench_press: {
    steps: [
      {
        step: 1,
        title: "Posicionamento",
        text: "Deite-se no banco, pés firmes no chão. Escápulas retraídas (juntas) e uma pegada firme na barra, mais larga que os ombros.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 2,
        title: "A Descida",
        text: "Retire a barra e desça controladamente até tocar levemente a linha dos mamilos. Inspire durante a descida.",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 3,
        title: "O Ângulo",
        text: "Mantenha os cotovelos em aproximadamente 45° a 60° em relação ao corpo. Ombros encaixados para trás.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 4,
        title: "A Subida",
        text: "Empurre a barra para cima de forma explosiva, expirando o ar. Não perca a retração das escápulas.",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=60"
      }
    ],
    tips: [
      "Imagine entortar a barra com as mãos para ativar os dorsais e estabilizar os ombros.",
      "Mantenha os pés empurrando o chão ('leg drive') para maior estabilidade.",
      "Sempre tenha um parceiro de treino ou barras de segurança ao buscar cargas altas."
    ],
    mistakes: [
      "Quicar a barra no peito para usar impulso.",
      "Retirar os pés do chão ou levantar o quadril do banco durante a subida.",
      "Abrir os cotovelos em 90°, sobrecarregando o manguito rotador."
    ]
  }
};

export function getFallbackExerciseDetails(exerciseName: string = "", muscle: string = ""): DetailedExercise {
  const nameLower = (exerciseName || "").toLowerCase();

  if (nameLower.includes("flexão") || nameLower.includes("flexao") || nameLower.includes("push") || nameLower.includes("burpee")) {
    return DETAILED_EXERCISES.push_up;
  }

  if (nameLower.includes("agachamento") || nameLower.includes("squat") || nameLower.includes("afundo") || nameLower.includes("avanço")) {
    return DETAILED_EXERCISES.squat;
  }

  if (nameLower.includes("supino") || nameLower.includes("bench press") || nameLower.includes("chest press")) {
    return DETAILED_EXERCISES.bench_press;
  }

  const targetMuscle = muscle || "Músculo alvo";

  return {
    steps: [
      {
        step: 1,
        title: "Preparação",
        text: `Ajuste a carga ou posicionamento para o exercício de ${exerciseName}. Alinhe suas articulações e contraia o abdômen.`,
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 2,
        title: "Fase Excêntrica",
        text: `Execute a descida ou alongamento de forma lenta e controlada, focando no trabalho do músculo (${targetMuscle}). Inspire.`,
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60"
      },
      {
        step: 3,
        title: "Fase Concêntrica",
        text: `Realize a contração de forma firme e controlada para a posição inicial. Expire no pico de esforço.`,
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60"
      }
    ],
    tips: [
      `Mantenha a postura e o core ativado para isolar o trabalho no músculo (${targetMuscle}).`,
      "Conecte a mente ao músculo trabalhado, controlando o peso sem usar o impulso de outras partes do corpo.",
      "Respire corretamente: inspire na fase de alongamento e expire na fase de contração."
    ],
    mistakes: [
      "Usar impulso excessivo (roubar no movimento) reduzindo a tensão no músculo correto.",
      "Realizar repetições curtas demais sem aproveitar a amplitude total segura das articulações.",
      "Descer o peso de forma brusca, sem controlar a fase negativa."
    ]
  };
}
