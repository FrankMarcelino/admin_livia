import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import { TenantListPage } from "@/pages/tenants/TenantListPage"

// Placeholder pages
const Dashboard = () => <div className="p-4">Dashboard Content</div>
const Feedbacks = () => <div className="p-4">Gerenciar Feedbacks</div>
const NeuroCores = () => <div className="p-4">Gerenciar NeuroCores</div>
const Agents = () => <div className="p-4">Gerenciar Agentes</div>
const Profile = () => <div className="p-4">Meu Perfil</div>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="empresas" element={<TenantListPage />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="neurocores" element={<NeuroCores />} />
          <Route path="agentes" element={<Agents />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
