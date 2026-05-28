interface OrderSummary {
  branchName: string;
  branchPhone: string;
  customerName: string;
  eventDate: string;
  eventTime: string;
  peopleCount: number;
  dishes: { name: string; quantity: number }[];
  notes?: string | null;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function buildWhatsAppUrl(data: OrderSummary): string {
  const dishesText = data.dishes
    .map((d) => `${d.quantity}x ${d.name}`)
    .join(", ");

  let message = `Hola *${data.branchName}*, quiero confirmar mi reserva.`;
  message += `\n\n*Cliente:* ${data.customerName}`;
  message += `\n*Fecha:* ${formatDate(data.eventDate)}`;
  message += `\n*Hora:* ${data.eventTime}`;
  message += `\n*Personas:* ${data.peopleCount}`;
  message += `\n*Platos:* ${dishesText}.`;

  if (data.notes) {
    message += `\n*Notas:* ${data.notes}`;
  }

  return `https://api.whatsapp.com/send?phone=${data.branchPhone}&text=${encodeURIComponent(message)}`;
}
