import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Cpu,
  Bot,
  User,
} from "lucide-react"

export const navigation = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Gerenciar Empresas",
    url: "/empresas",
    icon: Building2,
  },
  {
    title: "Gerenciar Feedbacks",
    url: "/feedbacks",
    icon: MessageSquare,
  },
  {
    title: "Gerenciar NeuroCores",
    url: "/neurocores",
    icon: Cpu,
  },
  // {
  //   title: "Gerenciar Agentes",
  //   url: "/agentes",
  //   icon: Bot,
  // },
]

export const userNavigation = [
  {
    title: "Meu Perfil",
    url: "/perfil",
    icon: User,
  },
]
