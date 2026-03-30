# Features Directory

The `src/features` directory follows Domain-Driven Design principles. Instead of coupling components, hooks, and APIs based on technical function, we organize by business domain (e.g., `projects`, `proposals`, `chat`, `analytics`).

## Structure of a Feature
```
src/features/my-feature/
├── api/          # Feature-specific api requests
├── components/   # Feature specific React components
├── hooks/        # Feature specific React hooks
├── stores/       # Feature specific Zustand stores
└── types/        # Feature specific typescript definitions
```
