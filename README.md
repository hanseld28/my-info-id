# 🆔 Meu Info ID - NFC Tag Management System

O **Meu Info ID** é uma solução completa para gerenciamento de identificação via tecnologia NFC. O projeto permite a criação de tags inteligentes que, ao serem lidas por smartphones, exibem informações críticas de contato e segurança de forma instantânea.

---

## 🚀 O Projeto

O sistema foi concebido para validar a ideia de identificação dinâmica. Diferente de uma etiqueta estática, o My Info ID permite que o proprietário atualize seus dados (nome, telefone, observações médicas ou de segurança) a qualquer momento, sem precisar trocar a tag física.

### 👥 Perfis de Acesso
- **Viewer (Público):** Visualização rápida dos dados da tag através de um `hash` único na URL.
- **Owner (Dono):** Ativação de tags novas e edição de dados existentes mediante o uso de um código de segurança de 8 dígitos.
- **Admin:** Controle de produção, geração de lotes de códigos e exportação de dados para logística.

---

## 🛠 Stack Tecnológica

- **Framework:** Next.js 14+ (App Router)
- **Backend:** Next.js API Routes (v1)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Estilização:** Tailwind CSS
- **Segurança:** Validação de tokens e códigos via Server-side (Bypass RLS para controle total via API)

---

## 📂 Estrutura de Arquivos



```text
src/
 ├── app/
 │    ├── api/v1/tags/    # Endpoints: generate, activate, update, list
 │    ├── admin/          # Gestão de produção e exportação CSV
 │    ├── activate/       # Fluxo de ativação para novos proprietários
 │    ├── manage/[hash]/  # Painel de edição do proprietário
 │    └── view/[hash]/    # Interface de visualização pública
 ├── components/          # Header, LoadingOverlay e UI escalável
 ├── lib/                 # Configuração Supabase e utils (Máscaras/Datas)