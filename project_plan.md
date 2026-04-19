# COYA - Marca Premium de Cacao

## 1. Descripción del Proyecto
COYA es una marca premium de cacao peruano que comercializa principalmente en el extranjero (Europa, Norteamérica). Su diferenciador es el impacto social: trabaja con comunidades rurales alejadas cuyos productores han superado violencia política, social e intrafamiliar. El sitio web debe transmitir emoción, dignidad humana y calidad artesanal.

**Target:** Consumidores europeos y norteamericanos conscientes del origen y el impacto social.
**Idiomas:** Español, Inglés, Alemán, Checo.

## 2. Estructura de Páginas
- `/` - Home (página principal con todas las secciones)
- `/products/:id` - Detalle de producto (fase futura)

## 3. Funcionalidades Core
- [x] Hero con slideshow dinámico (imágenes/videos de cacao y productores)
- [x] Sección de proveedores/productores con historias de superación
- [x] Catálogo de productos dinámico con filtros
- [x] Carrito de compras flotante
- [x] Selector de 4 idiomas (ES, EN, DE, CS)
- [x] Banner de cookies
- [x] Newsletter en footer
- [ ] Checkout / Pago (fase futura con Stripe)
- [ ] Panel de administración (fase futura con Supabase)

## 4. Modelo de Datos (Mock)
- Productores: id, nombre, región, historia, imagen, impacto
- Productos: id, nombre, origen, precio, descripción, imagen, categoría, stock

## 5. Integraciones
- Supabase: No conectado (fase futura para pedidos y usuarios)
- Shopify: No conectado (fase futura)
- Stripe: No conectado (fase futura para pagos)

## 6. Plan de Fases

### Fase 1: Sitio Web Completo (ACTUAL)
- Goal: Construir el sitio completo con todas las secciones visuales
- Deliverable: Home page funcional con hero, proveedores, catálogo, carrito, i18n, cookies

### Fase 2: Pagos y Checkout
- Goal: Integrar Stripe para procesar pedidos
- Deliverable: Flujo completo de compra

### Fase 3: Backend y Administración
- Goal: Conectar Supabase para gestionar productos y pedidos
- Deliverable: Panel admin, base de datos real
