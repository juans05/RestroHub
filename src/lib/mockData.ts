export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  isAvailable: boolean;
  categoryId: string;
  order: number;
}

export interface Branch {
  id: string;
  name: string;
  imageUrl: string;
  address: string;
  phone: string;
  hours: { [key: string]: string };
  mapsUrl: string;
  isActive: boolean;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName: string;
  eventDate: string;
  eventTime: string;
  peopleCount: number;
  status: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO';
  notes: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
}

export interface SystemConfig {
  logoUrl: string;
  businessName: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  bannerTitle: string;
  bannerText: string;
  seoTitle: string;
  seoDescription: string;
}

// Initial Data Seeds
export const initialCategories: Category[] = [
  { id: "cat-1", name: "Pastelería Fina", slug: "pasteleria-fina", order: 1 },
  { id: "cat-2", name: "Salados y Quiches", slug: "salados-y-quiches", order: 2 },
  { id: "cat-3", name: "Bebidas Calientes", slug: "bebidas-calientes", order: 3 },
  { id: "cat-4", name: "Bebidas Frías", slug: "bebidas-frias", order: 4 },
];

export const initialDishes: Dish[] = [
  // Pastelería Fina
  {
    id: "dish-1",
    name: "Torta María Almenara",
    description: "Delicioso bizcocho húmedo de chocolate relleno de fudge artesanal y manjarblanco con virutas de chocolate belga.",
    price: 18.90,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-1",
    order: 1
  },
  {
    id: "dish-2",
    name: "Pie de Limón Premium",
    description: "Masa quebrada crujiente de mantequilla rellena de una ácida crema de limón del norte, coronada con merengue suizo dorado.",
    price: 12.90,
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-1",
    order: 2
  },
  {
    id: "dish-3",
    name: "Milhojas de Manjarblanco de Olla",
    description: "Finas láminas de hojaldre crujiente horneado rellenas de nuestro manjarblanco casero batido a mano.",
    price: 11.50,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-1",
    order: 3
  },
  {
    id: "dish-4",
    name: "Cheesecake de Frutos del Bosque",
    description: "Suave crema de queso horneada estilo NY sobre base crocante, cubierta con mermelada rústica de fresas, frambuesas y arándanos.",
    price: 14.90,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-1",
    order: 4
  },
  {
    id: "dish-5",
    name: "Croissant de Almendra & Frangipane",
    description: "Hojaldre 100% mantequilla relleno de crema de almendras (frangipane) y decorado con almendras fileteadas tostadas y azúcar glas.",
    price: 9.90,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: false, // Out of stock example
    categoryId: "cat-1",
    order: 5
  },

  // Salados y Quiches
  {
    id: "dish-6",
    name: "Quiche de Lomo Saltado",
    description: "Exclusiva corteza crocante rellena de lomo saltado jugoso al wok con queso crema fundido y crema sazonada.",
    price: 15.90,
    imageUrl: "https://images.unsplash.com/photo-1628191139360-408a5649b3b6?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-2",
    order: 1
  },
  {
    id: "dish-7",
    name: "Quiche de Espinaca y Queso Ricotta",
    description: "Masa crujiente horneada al huevo con espinacas tiernas salteadas, ricotta fresca italiana y queso parmesano.",
    price: 13.90,
    imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-2",
    order: 2
  },
  {
    id: "dish-8",
    name: "Empanada Hojaldrada de Carne Picada",
    description: "Exquisita masa hojaldrada horneada rellena de carne picada jugosa de res, aceituna negra, huevo duro y pasas.",
    price: 8.50,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-2",
    order: 3
  },
  {
    id: "dish-9",
    name: "Triple Clásico (Palta, Huevo & Tomate)",
    description: "Sándwich de pan de molde extra suave relleno con láminas de palta fuerte, huevo picado con mayonesa casera y tomates frescos.",
    price: 9.90,
    imageUrl: "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-2",
    order: 4
  },

  // Bebidas Calientes
  {
    id: "dish-10",
    name: "Capuccino de Olla",
    description: "Espresso doble de especialidad con leche emulsionada y un toque de canela orgánica peruana y chocolate rallado.",
    price: 9.50,
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-3",
    order: 1
  },
  {
    id: "dish-11",
    name: "Chocolate Caliente 70% Cacao",
    description: "Elaborado con chocolate de especialidad de origen Cusco, leche descremada, canela y un toque de clavo de olor.",
    price: 11.00,
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-3",
    order: 2
  },
  {
    id: "dish-12",
    name: "Latte de Vainilla Francesa",
    description: "Espresso suave mezclado al vapor con leche emulsionada y jarabe artesanal de vaina de vainilla de Madagascar.",
    price: 10.50,
    imageUrl: "https://images.unsplash.com/photo-1461023058043-03348144b19c?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-3",
    order: 3
  },

  // Bebidas Frías
  {
    id: "dish-13",
    name: "Iced Latte Caramel Machiato",
    description: "Espresso concentrado vertido sobre leche fría con jarabe de vainilla y una densa rejilla de caramelo casero, servido con hielo.",
    price: 11.50,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-4",
    order: 1
  },
  {
    id: "dish-14",
    name: "Chicha Morada de Maíz de Urubamba",
    description: "Receta tradicional peruana. Preparada en olla con maíz morado, cáscara de piña, manzanas, membrillo, clavo y canela.",
    price: 8.00,
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-4",
    order: 2
  },
  {
    id: "dish-15",
    name: "Jugo Natural de Maracuyá Refrescante",
    description: "Pura fruta de maracuyá licuada con hielo y un toque de azúcar rubia. 100% natural sin colorantes.",
    price: 8.50,
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
    isActive: true,
    isAvailable: true,
    categoryId: "cat-4",
    order: 3
  }
];

export const initialBranches: Branch[] = [
  {
    id: "branch-1",
    name: "Sede Miraflores",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80",
    address: "Av. José Larco 745, Miraflores, Lima",
    phone: "+51 987 654 321",
    hours: {
      "Lunes": "08:00 AM - 10:00 PM",
      "Martes": "08:00 AM - 10:00 PM",
      "Miércoles": "08:00 AM - 10:00 PM",
      "Jueves": "08:00 AM - 10:00 PM",
      "Viernes": "08:00 AM - 11:00 PM",
      "Sábado": "08:00 AM - 11:00 PM",
      "Domingo": "08:00 AM - 09:30 PM",
    },
    mapsUrl: "https://maps.google.com/?q=Av.+Jose+Larco+745,+Miraflores",
    isActive: true
  },
  {
    id: "branch-2",
    name: "Sede San Isidro",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
    address: "Calle Los Conquistadores 410, San Isidro, Lima",
    phone: "+51 987 654 322",
    hours: {
      "Lunes": "07:30 AM - 10:00 PM",
      "Martes": "07:30 AM - 10:00 PM",
      "Miércoles": "07:30 AM - 10:00 PM",
      "Jueves": "07:30 AM - 10:30 PM",
      "Viernes": "07:30 AM - 10:30 PM",
      "Sábado": "08:00 AM - 10:30 PM",
      "Domingo": "08:00 AM - 09:00 PM",
    },
    mapsUrl: "https://maps.google.com/?q=Calle+Los+Conquistadores+410,+San+Isidro",
    isActive: true
  },
  {
    id: "branch-3",
    name: "Sede Chacarilla (Surco)",
    imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80",
    address: "Av. Primavera 1280, Chacarilla, Surco, Lima",
    phone: "+51 987 654 323",
    hours: {
      "Lunes": "08:00 AM - 10:00 PM",
      "Martes": "08:00 AM - 10:00 PM",
      "Miércoles": "08:00 AM - 10:00 PM",
      "Jueves": "08:00 AM - 10:00 PM",
      "Viernes": "08:00 AM - 10:30 PM",
      "Sábado": "08:00 AM - 10:30 PM",
      "Domingo": "08:00 AM - 10:00 PM",
    },
    mapsUrl: "https://maps.google.com/?q=Av.+Primavera+1280,+Surco",
    isActive: true
  }
];

export const initialConfig: SystemConfig = {
  logoUrl: "/logo.png",
  businessName: "Rauletti & Co.",
  description: "Repostería fina y salados artesanales elaborados con amor y los mejores ingredientes.",
  primaryColor: "#6B1A2A",
  secondaryColor: "#C5A059",
  whatsapp: "+51 987 654 321",
  email: "contacto@rauletti.com",
  instagram: "https://instagram.com/rauletti.co",
  facebook: "https://facebook.com/rauletti.co",
  bannerTitle: "El arte de la repostería artesanal",
  bannerText: "Déjate enamorar por nuestras tortas, quiches y cafés preparados a mano diariamente. Reserva tu mesa o solicita tu pedido para recoger en tu sede favorita.",
  seoTitle: "Rauletti & Co. | Carta Digital, Tortas y Reservas Premium",
  seoDescription: "Exquisita repostería fina, empanadas, salados y desayunos. Ordena en línea y agenda tu reserva para disfrutar de una dulce experiencia en San Isidro, Miraflores y Surco."
};

// Initial Orders Mock (for Admin Panel)
export const initialOrders: Order[] = [
  {
    id: "ORD-9821",
    customerName: "Camila Varela",
    customerPhone: "+51 992 112 342",
    branchId: "branch-1",
    branchName: "Sede Miraflores",
    eventDate: "2026-05-28",
    eventTime: "16:00",
    peopleCount: 3,
    status: "PENDIENTE",
    notes: "Celebración de cumpleaños de mi madre, desearíamos velas por favor.",
    createdAt: "2026-05-27T10:14:00Z",
    total: 31.80,
    items: [
      { dishId: "dish-1", dishName: "Torta María Almenara", quantity: 1, price: 18.90 },
      { dishId: "dish-2", dishName: "Pie de Limón Premium", quantity: 1, price: 12.90 }
    ]
  },
  {
    id: "ORD-9743",
    customerName: "Diego Solari",
    customerPhone: "+51 981 445 110",
    branchId: "branch-2",
    branchName: "Sede San Isidro",
    eventDate: "2026-05-27",
    eventTime: "18:30",
    peopleCount: 2,
    status: "CONFIRMADO",
    notes: "",
    createdAt: "2026-05-26T21:05:00Z",
    total: 42.80,
    items: [
      { dishId: "dish-6", dishName: "Quiche de Lomo Saltado", quantity: 2, price: 15.90 },
      { dishId: "dish-11", dishName: "Chocolate Caliente 70% Cacao", quantity: 1, price: 11.00 }
    ]
  },
  {
    id: "ORD-9610",
    customerName: "Mariana Costa",
    customerPhone: "+51 910 882 121",
    branchId: "branch-3",
    branchName: "Sede Chacarilla (Surco)",
    eventDate: "2026-05-25",
    eventTime: "09:00",
    peopleCount: 4,
    status: "ENTREGADO",
    notes: "Reunión de desayuno de oficina.",
    createdAt: "2026-05-24T18:30:00Z",
    total: 75.60,
    items: [
      { dishId: "dish-9", dishName: "Triple Clásico (Palta, Huevo & Tomate)", quantity: 4, price: 9.90 },
      { dishId: "dish-12", dishName: "Latte de Vainilla Francesa", quantity: 4, price: 10.50 }
    ]
  }
];

// LocalStorage Helper for Client-Side CMS Simulation
class MockDatabase {
  private isBrowser = typeof window !== 'undefined';

  private get(key: string, defaultValue: any) {
    if (!this.isBrowser) return defaultValue;
    const data = localStorage.getItem(`restocms_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  }

  private set(key: string, value: any) {
    if (!this.isBrowser) return;
    localStorage.setItem(`restocms_${key}`, JSON.stringify(value));
  }

  getCategories(): Category[] {
    return this.get('categories', initialCategories);
  }

  saveCategory(cat: Category) {
    const cats = this.getCategories();
    const index = cats.findIndex(c => c.id === cat.id);
    if (index >= 0) {
      cats[index] = cat;
    } else {
      cats.push(cat);
    }
    this.set('categories', cats);
  }

  deleteCategory(id: string) {
    const cats = this.getCategories().filter(c => c.id !== id);
    this.set('categories', cats);
    // Delete dishes in cascade
    const dishes = this.getDishes().filter(d => d.categoryId !== id);
    this.set('dishes', dishes);
  }

  getDishes(): Dish[] {
    return this.get('dishes', initialDishes);
  }

  saveDish(dish: Dish) {
    const dishes = this.getDishes();
    const index = dishes.findIndex(d => d.id === dish.id);
    if (index >= 0) {
      dishes[index] = dish;
    } else {
      dishes.push(dish);
    }
    this.set('dishes', dishes);
  }

  deleteDish(id: string) {
    const dishes = this.getDishes().filter(d => d.id !== id);
    this.set('dishes', dishes);
  }

  getBranches(): Branch[] {
    return this.get('branches', initialBranches);
  }

  saveBranch(branch: Branch) {
    const branches = this.getBranches();
    const index = branches.findIndex(b => b.id === branch.id);
    if (index >= 0) {
      branches[index] = branch;
    } else {
      branches.push(branch);
    }
    this.set('branches', branches);
  }

  getOrders(): Order[] {
    return this.get('orders', initialOrders);
  }

  saveOrder(order: Order) {
    const orders = this.getOrders();
    orders.unshift(order);
    this.set('orders', orders);
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index].status = status;
      this.set('orders', orders);
    }
  }

  getConfig(): SystemConfig {
    return this.get('config', initialConfig);
  }

  saveConfig(config: SystemConfig) {
    this.set('config', config);
  }
}

export const mockDB = new MockDatabase();
