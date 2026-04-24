const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type StringEntry = FormDataEntryValue | null;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  imageFile: File;
}

// QUE HACE: Normaliza entradas textuales de FormData para evitar ruido por espacios y tipos inesperados.
// POR QUE SE ELIGIO: Unificar la frontera de datos en server actions evita duplicación y errores de validación inconsistentes.
// COMO FUNCIONA: Verifica que el valor sea string, aplica trim y usa fallback cuando el campo no existe o es binario.
// APRENDE MAS: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations y https://react.dev/reference/react-dom/components/form
function sanitizeText(value: StringEntry, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

// QUE HACE: Garantiza que una URL opcional cumpla protocolo permitido para datos públicos del portafolio.
// POR QUE SE ELIGIO: Validar en el servidor protege consistencia de datos y evita almacenar esquemas inseguros.
// COMO FUNCIONA: Si hay valor, parsea con URL nativa y permite solo http/https; si no hay valor devuelve null.
// APRENDE MAS: https://developer.mozilla.org/docs/Web/API/URL/URL y https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
function normalizeOptionalUrl(value: StringEntry) {
  const rawUrl = sanitizeText(value);
  if (!rawUrl) return null;

  try {
    const parsedUrl = new URL(rawUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("URL inválida");
    }
    return parsedUrl.toString();
  } catch {
    throw new Error("La URL debe usar http o https");
  }
}

// QUE HACE: Valida y normaliza las credenciales del formulario de login en un contrato explícito.
// POR QUE SE ELIGIO: Un contrato tipado en la frontera reduce acoplamiento con el provider de autenticación.
// COMO FUNCIONA: Lee email y password desde FormData, aplica normalización y exige presencia de ambos campos.
// APRENDE MAS: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations y https://supabase.com/docs/reference/javascript/auth-signinwithpassword
export function parseLoginCredentials(formData: FormData): LoginCredentials {
  const email = sanitizeText(formData.get("email"));
  const password = sanitizeText(formData.get("password"));

  if (!email || !password) {
    throw new Error("Credenciales incompletas");
  }

  return { email, password };
}

// QUE HACE: Construye el payload validado para crear proyectos con reglas de negocio consistentes.
// POR QUE SE ELIGIO: Evita lógica duplicada en acciones y mantiene una única fuente de verdad para validación.
// COMO FUNCIONA: Extrae campos, valida obligatorios, normaliza tech stack, valida archivo y retorna estructura tipada.
// APRENDE MAS: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations y https://developer.mozilla.org/docs/Web/API/File
export function parseCreateProjectPayload(
  formData: FormData,
): CreateProjectPayload {
  const title = sanitizeText(formData.get("title"));
  const description = sanitizeText(formData.get("description"));
  const techStackInput = sanitizeText(formData.get("tech_stack"));
  const liveUrl = normalizeOptionalUrl(formData.get("live_url"));
  const githubUrl = normalizeOptionalUrl(formData.get("github_url"));
  const imageEntry = formData.get("image");
  const imageFile = imageEntry instanceof File ? imageEntry : null;

  if (!title || !description || !techStackInput) {
    throw new Error("Campos obligatorios incompletos");
  }
  if (!imageFile || imageFile.size === 0) {
    throw new Error("Debes subir una imagen");
  }
  if (!imageFile.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen válida");
  }
  if (imageFile.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("La imagen supera el límite de 5MB");
  }

  const techStack = techStackInput
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);

  return {
    title,
    description,
    techStack,
    liveUrl,
    githubUrl,
    imageFile,
  };
}

// QUE HACE: Verifica que el identificador recibido para mutaciones destructivas sea UUID válido.
// POR QUE SE ELIGIO: Validar temprano reduce superficie de error y bloquea entradas malformadas.
// COMO FUNCIONA: Ejecuta regex UUID v4 y lanza error de dominio cuando el formato no coincide.
// APRENDE MAS: https://www.rfc-editor.org/rfc/rfc4122 y https://orm.drizzle.team/docs/delete
export function assertValidProjectId(id: string) {
  if (!UUID_V4_REGEX.test(id)) {
    throw new Error("ID inválido");
  }
}
