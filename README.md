# WDC Web Interface

## Sobre o Projeto

Este é um painel administrativo moderno desenvolvido com tecnologias de ponta para oferecer uma experiência de usuário intuitiva e responsiva. Projetado para facilitar a gestão e visualização de dados em tempo real, este sistema permite acompanhar pedidos, aprovar solicitações e visualizar estatísticas importantes para a tomada de decisões.

## Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React para desenvolvimento de aplicações web com renderização híbrida
- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript 5.5**: Superset de JavaScript que adiciona tipagem estática
- **TanStack Query**: Gerenciamento de estados assíncronos e cache de dados
- **Tailwind CSS**: Framework CSS utilitário para design responsivo e consistente
- **Shadcn UI**: Componentes de UI acessíveis e customizáveis
- **Radix UI**: Primitivos de UI sem estilos e acessíveis
- **Zod**: Validação de esquemas de dados com inferência de tipos
- **Recharts**: Biblioteca para visualização de dados e gráficos

### DevOps & Ferramentas
- **ESLint**: Ferramenta de análise de código estática
- **Jest**: Framework de testes para JavaScript
- **PostCSS**: Ferramenta para transformar CSS com plugins JavaScript

## Arquitetura do Projeto

Este projeto utiliza uma **arquitetura baseada em recursos (feature-based)**, organizando o código por domínios de negócio em vez de categorias técnicas. Esta abordagem traz vários benefícios:

- **Coesão**: Código relacionado permanece junto
- **Escalabilidade**: Facilidade para adicionar novos recursos
- **Manutenção**: Menor acoplamento entre diferentes partes do sistema
- **Colaboração**: Equipes podem trabalhar em diferentes recursos simultaneamente
- **Vite**: Ferramenta de build ultrarrápida para desenvolvimento moderno
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **shadcn/ui**: Componentes de UI reutilizáveis e acessíveis
- **React Query**: Gerenciamento de estado do servidor e cache de dados
- **React Router**: Navegação e roteamento para aplicações React
- **Zod**: Validação de esquemas de dados
- **Recharts**: Biblioteca de gráficos responsivos

## Requisitos de Sistema

- Node.js 18 ou superior
- npm 9 ou superior

## Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITÓRIO]

# Navegue até o diretório do projeto
cd wdc-web-interface

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run build:dev`: Compila o projeto para desenvolvimento
- `npm run lint`: Executa a verificação de linting
- `npm run preview`: Inicia um servidor local para visualizar a build de produção

## Estrutura do Projeto

O projeto segue uma arquitetura modular e organizada para facilitar a manutenção e escalabilidade:

```
src/
├── assets/        # Recursos estáticos (imagens, fontes, etc.)
├── components/    # Componentes reutilizáveis
├── hooks/         # Hooks personalizados
├── layouts/       # Layouts da aplicação
├── lib/           # Utilitários e configurações
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API e integração
├── store/         # Gerenciamento de estado global
├── styles/        # Estilos globais
└── utils/         # Funções utilitárias
```

## Contribuição

Para contribuir com o projeto:

1. Crie um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Implantação

O projeto pode ser implantado em qualquer serviço de hospedagem que suporte aplicações Node.js, como Vercel, Netlify ou GitHub Pages.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido pela equipe de Sistemas WDC