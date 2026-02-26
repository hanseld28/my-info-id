# 🆔 Meu Info ID - NFC Tag Management System

O **Meu Info ID** é uma solução completa para gerenciamento de identificação via tecnologia NFC. O projeto permite a criação de tags inteligentes que, ao serem lidas por smartphones, exibem informações críticas de contato e segurança de forma instantânea.

---

## 🚀 O Projeto

O sistema foi concebido para validar a ideia de identificação dinâmica. Diferente de uma etiqueta estática, o My Info ID permite que o proprietário atualize seus dados (nome, telefone, observações médicas ou de segurança) a qualquer momento, sem precisar trocar a tag física.

### 👥 Perfis de Acesso
- **Viewer (Público):** Visualização rápida dos dados da tag através de um `hash` único na URL.
- **Owner (Dono):** Ativação de tags novas e edição de dados existentes mediante o uso de um código de segurança de 6 caracteres.
- **Admin:** Controle de produção, geração de lotes de códigos e exportação de dados para logística.

---

## 🛠 Stack Tecnológica

- **Framework:** Next.js 14+ (App Router)
- **Backend:** Next.js API Routes (v1)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Estilização:** Tailwind CSS
- **Segurança:** Validação de tokens e códigos via Server-side (Bypass RLS para controle total via API)

---

## ⚖️ Licença
Este projeto está licenciado sob a Apache License 2.0 com a Commons Clause.

#### O que isso significa?
A Apache License 2.0 é uma licença permissiva, mas a Commons Clause adiciona uma restrição crítica: você não pode vender o software.

- Você pode: Copiar, modificar e usar o código para fins internos ou pessoais.

- Você NÃO pode: Vender o software ou cobrar por serviços que consistam principalmente no valor deste software.

O objetivo desta licença é manter o projeto aberto para colaboração e transparência, enquanto protege os criadores de exploração comercial não autorizada da ideia e do sistema.

_Copyright (c) 2026 Meu Info ID._