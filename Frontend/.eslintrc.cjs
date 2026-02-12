module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended', // 👈 NUEVO: Reglas para React Query
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', '@tanstack/query'], // 👈 NUEVO: Activa el plugin
  rules: {
    // 👇 NUEVO: Evita errores molestos si no usas PropTypes (común en Vite+JS)
    'react/prop-types': 'off',
    
    // 👇 MEJORA: Cambia "error" por "aviso" en variables no usadas (menos estrés)
    'no-unused-vars': 'warn',

    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}