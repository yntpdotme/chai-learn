// Path: type.d.ts
export {}

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    breadcrumb?:
      | string
      | ((match: {
          params: Record<string, string>
          loaderData?: unknown
        }) => string)
  }
}