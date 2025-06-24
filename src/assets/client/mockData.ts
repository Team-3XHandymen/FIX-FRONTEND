
export const clientMockData = {
  user: {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(512) 123-4567",
    addresses: [
      {
        type: "Home",
        street: "123 Main Street",
        city: "Austin",
        state: "TX",
        zip: "78701"
      },
      {
        type: "Work",
        street: "456 Business Ave",
        city: "Austin",
        state: "TX",
        zip: "78702"
      }
    ]
  },
  bookings: {
    upcoming: [
      {
        id: 1,
        service: "Kitchen Sink Repair",
        handyman: "Abraham Garcia",
        date: "January 28, 2023",
        time: "2:00 PM - 3:00 PM",
        price: "$95.00",
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        id: 2,
        service: "Furniture Assembly",
        handyman: "Sarah Pierce",
        date: "February 2, 2023",
        time: "10:00 AM - 12:00 PM",
        price: "$180.00",
        photo: "https://randomuser.me/api/portraits/women/67.jpg"
      }
    ]
  },
  serviceHistory: [
    {
      id: 1,
      name: "Plumbing Repair",
      handyman: "Abraham Garcia",
      date: "January 10, 2023",
      status: "Completed",
      price: "$125.00",
      handymanPhoto: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Electrical Installation",
      handyman: "Mike Johnson",
      date: "December 15, 2022",
      status: "Completed",
      price: "$210.00",
      handymanPhoto: "https://randomuser.me/api/portraits/men/55.jpg"
    },
    {
      id: 3,
      name: "Furniture Assembly",
      handyman: "Francisco Ramirez",
      date: "November 3, 2022",
      status: "Canceled",
      price: "$90.00",
      handymanPhoto: "https://randomuser.me/api/portraits/men/76.jpg"
    }
  ],
  reviews: [
    {
      id: 1,
      handyman: "Abraham Garcia",
      service: "Plumbing Repair",
      date: "January 15, 2023",
      rating: 5,
      comment: "Exceptional service from start to finish. Abraham was very professional and knowledgeable. He fixed my sink perfectly!",
      handymanPhoto: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      handyman: "Mike Johnson",
      service: "Electrical Installation",
      date: "December 22, 2022",
      rating: 4,
      comment: "Great job installing my ceiling fan. He was polite, fast, and cleaned up after the work.",
      handymanPhoto: "https://randomuser.me/api/portraits/men/55.jpg"
    }
  ],
  paymentMethods: [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/24",
      default: true
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8765",
      expiry: "03/25",
      default: false
    }
  ],
  billingHistory: [
    {
      id: "INV-001-2023",
      date: "Jan 15, 2023",
      description: "Plumbing Repair",
      amount: "$125.00",
      status: "Paid"
    },
    {
      id: "INV-002-2023",
      date: "Dec 20, 2022",
      description: "Electrical Installation",
      amount: "$210.00",
      status: "Paid"
    },
    {
      id: "INV-003-2022",
      date: "Nov 05, 2022",
      description: "Furniture Assembly",
      amount: "$85.00",
      status: "Pending"
    }
  ]
};
