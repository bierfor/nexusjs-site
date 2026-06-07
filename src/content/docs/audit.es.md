# Auditoría

Ejecuta una auditoría de seguridad en cualquier momento.

## Qué escanea

- CVEs conocidas en dependencias (base de datos OSV)
- Dependencias no usadas (bloat de bundle)
- Paquetes desactualizados
- Fugas de secretos en código fuente
- Configuración insegura

## Ejecutar auditoría

```bash
nexus audit
```

## Política de override

Crea `nexus-audit.json` para suprimir falsos positivos:

```json
{
  "ignore": {
    "CVE-2024-1234": "No explotable en nuestro uso"
  }
}
```
