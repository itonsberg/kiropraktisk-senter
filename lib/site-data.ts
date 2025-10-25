/**
 * Kiropraktisk Senter - Site Data
 * Extracted from https://kiropraktisksenter.no/
 */

export const siteConfig = {
  name: "Kiropraktisk Senter",
  title: "Kiropraktisk Senter – Kiropraktor & Massør",
  description: "Profesjonell kiropraktikk og massasje i Tønsberg. Vi har behandlet over 5000 pasienter siden 1981.",
  url: "https://kiropraktisksenter.no",
  location: {
    address: "Eikveien 33",
    postalCode: "3122",
    city: "Tønsberg",
    country: "Norge"
  },
  contact: {
    phone: "+47 400 95 900",
    email: "post@kiropraktisksenter.no"
  },
  social: {
    facebook: "https://facebook.com/kiropraktisksenter",
    instagram: "https://instagram.com/kiropraktisksenter"
  }
};

export const services = [
  {
    id: "rygg",
    title: "Ryggsmerter",
    description: "Profesjonell behandling av ryggsmerter",
    url: "/tjenester/rygg",
    icon: "spine"
  },
  {
    id: "nakke",
    title: "Nakke",
    description: "Profesjonell behandling av nakkesmerter",
    url: "/tjenester/nakke",
    icon: "neck"
  },
  {
    id: "skulder",
    title: "Skulder",
    description: "Profesjonell behandling av skuldersmerter",
    url: "/tjenester/skulder",
    icon: "shoulder"
  },
  {
    id: "kne",
    title: "Knesmerter",
    description: "Profesjonell behandling av knesmerter",
    url: "/tjenester/kne",
    icon: "knee"
  },
  {
    id: "myalgi",
    title: "Myalgi",
    description: "Profesjonell behandling av muskelsmerter",
    url: "/tjenester/myalgi",
    icon: "muscle"
  },
  {
    id: "ankel-fot",
    title: "Ankel og Fot",
    description: "Profesjonell behandling av fot- og ankelplager",
    url: "/tjenester/ankel-fot",
    icon: "foot"
  },
  {
    id: "handledd",
    title: "Håndledd",
    description: "Profesjonell behandling av håndleddplager",
    url: "/tjenester/handledd",
    icon: "hand"
  },
  {
    id: "albue",
    title: "Albue",
    description: "Profesjonell behandling av albueplager",
    url: "/tjenester/albue",
    icon: "arm"
  },
  {
    id: "kjeve",
    title: "Kjeve",
    description: "Profesjonell behandling av kjeveplager",
    url: "/tjenester/kjeve",
    icon: "jaw"
  },
  {
    id: "hodepine",
    title: "Hodepine",
    description: "Profesjonell behandling av hodepine",
    url: "/tjenester/hodepine",
    icon: "head"
  }
];

export const treatments = [
  {
    name: "Kiropraktikk",
    description: "Profesjonell kiropraktisk behandling"
  },
  {
    name: "Massasje",
    description: "Terapeutisk massasje"
  },
  {
    name: "Low-level Laser",
    description: "Avansert laserbehandling"
  },
  {
    name: "Shock Wave",
    description: "Sjokkbølgebehandling"
  },
  {
    name: "PMST",
    description: "Pulserende magnetfeltterapi"
  },
  {
    name: "PEMF",
    description: "Pulserende elektromagnetisk feltterapi"
  }
];

export const teamMembers = [
  {
    name: "Terapeut",
    role: "Kiropraktor",
    image: "/media/images/image-1.jpg"
  }
];

export const stats = {
  since: 1981,
  patients: "5000+",
  experience: new Date().getFullYear() - 1981 + " år"
};
