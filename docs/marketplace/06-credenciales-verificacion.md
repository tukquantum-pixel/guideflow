# Sistema de Credenciales y Verificación — Resumen Crítico

## 🎯 Objetivo

Sistema de verificación de guías profesionales para generar confianza en el marketplace.
Sin verificación no hay confianza, sin confianza no hay marketplace.

## 🔒 Niveles de Verificación

| Nivel | Sello | Requisitos | Marketplace |
| --- | --- | --- | --- |
| NONE | ⚪ Sin verificar | Solo perfil básico | No aparece |
| PENDING | 🔶 En proceso | Documentos subidos, pendientes de revisión | No aparece |
| VERIFIED | ✅ Verificado | Titulación + Seguro RC + Documentos validados | Sí |

## 📋 Tipos de Documento (CredentialType)

| Tipo | Descripción | Obligatorio para verificación |
| --- | --- | --- |
| TITULO | Titulación oficial (Técnico Deportivo, etc.) | ✅ Sí |
| SEGURO | Póliza RC / Accidentes | ✅ Sí |
| LICENCIA | Licencia federativa / municipal | Según actividad |
| EXPERIENCIA | Certificados de empresa, vida laboral | Recomendado |
| IDENTIDAD | DNI / NIE / Pasaporte | ✅ Sí |

## ⚖️ Marco Legal España

### Titulaciones por actividad

- **Senderismo**: Técnico Deportivo Media Montaña o Guía Turismo
- **Escalada**: Técnico Deportivo en Escalada
- **Alta montaña**: Guía UIAGM (AEGM)
- **Barrancos**: Técnico Deportivo en Barrancos
- **BTT**: Técnico Deportivo en Ciclismo
- **Esquí montaña**: Técnico Deportivo Esquí de Montaña
- **Kayak**: Técnico Deportivo en Piragüismo

### Seguros obligatorios

- **RC mínima**: 150.000€ por siniestro (ley)
- **Accidentes**: Cobertura médica y rescate (recomendado)

> [!WARNING]
> Las competencias están transferidas a CCAA. Un guía válido en Aragón puede no serlo en Cataluña.

## 🔄 Flujo de Verificación

1. Guía sube documentos (PDF/imagen)
2. Estado → PENDING
3. Revisión manual (48-72h)
4. Si OK → APPROVED, si no → REJECTED con nota
5. Guía con titulación + seguro APPROVED → verificationLevel = VERIFIED
6. Caducidad → cron diario suspende automáticamente

## 📊 Modelo de Datos (Prisma)

```prisma
model Credential {
  id, guideId, type (CredentialType), name, issuingBody,
  documentUrl, issueDate, expiryDate, coverageAmount,
  status (CredentialStatus), verifiedAt, verifiedBy, rejectionNote
}
```

## 🛡️ Términos Legales Clave

Los documentos del guía han sido revisados por GuideFlow.
GuideFlow no se hace responsable de la veracidad ni de la actuación del guía.
Falsedad documental → bloqueo permanente + denuncia.
