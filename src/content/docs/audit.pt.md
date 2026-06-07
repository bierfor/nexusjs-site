# Auditoria

Execute uma auditoria de segurança a qualquer momento.

## O que ela escaneia

- CVEs conhecidas em dependências (banco de dados OSV)
- Dependências não usadas (bloat de bundle)
- Pacotes desatualizados
- Vazamentos de segredos no código fonte
- Configuração insegura

## Executar auditoria

```bash
nexus audit
```

## Política de override

Crie `nexus-audit.json` para suprimir falsos positivos:

```json
{
  "ignore": {
    "CVE-2024-1234": "Não explorável no nosso uso"
  }
}
```
