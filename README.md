# WDC Web Interface

## Sobre o Projeto

Este é um painel administrativo moderno desenvolvido com tecnologias de ponta para oferecer uma experiência de usuário intuitiva e responsiva. Projetado para facilitar a gestão e visualização de dados em tempo real.

## Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript 5.5**: Superset de JavaScript que adiciona tipagem estática
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