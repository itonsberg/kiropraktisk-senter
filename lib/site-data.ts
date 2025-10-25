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
    url: "/behandlinger/rygg",
    icon: "spine"
  },
  {
    id: "nakke",
    title: "Nakke",
    description: "Profesjonell behandling av nakkesmerter",
    url: "/behandlinger/nakke",
    icon: "neck"
  },
  {
    id: "skulder",
    title: "Skulder",
    description: "Profesjonell behandling av skuldersmerter",
    url: "/behandlinger/skulder",
    icon: "shoulder"
  },
  {
    id: "kne",
    title: "Knesmerter",
    description: "Profesjonell behandling av knesmerter",
    url: "/behandlinger/kne",
    icon: "knee"
  },
  {
    id: "myalgi",
    title: "Myalgi",
    description: "Profesjonell behandling av muskelsmerter",
    url: "/behandlinger/myalgi",
    icon: "muscle"
  },
  {
    id: "ankel-fot",
    title: "Ankel og Fot",
    description: "Profesjonell behandling av fot- og ankelplager",
    url: "/behandlinger/ankel-fot",
    icon: "foot"
  },
  {
    id: "handledd",
    title: "Håndledd",
    description: "Profesjonell behandling av håndleddplager",
    url: "/behandlinger/handledd",
    icon: "hand"
  },
  {
    id: "albue",
    title: "Albue",
    description: "Profesjonell behandling av albueplager",
    url: "/behandlinger/albue",
    icon: "arm"
  },
  {
    id: "kjeve",
    title: "Kjeve",
    description: "Profesjonell behandling av kjeveplager",
    url: "/behandlinger/kjeve",
    icon: "jaw"
  },
  {
    id: "hodepine",
    title: "Hodepine",
    description: "Profesjonell behandling av hodepine",
    url: "/behandlinger/hodepine",
    icon: "head"
  }
];

export const treatments = [
  {
    name: "Kiropraktikk",
    description: "Profesjonell kiropraktisk behandling",
    url: "/tjenester/metoder/kiropraktikk"
  },
  {
    name: "Massasje",
    description: "Terapeutisk massasje",
    url: "/tjenester/metoder/massasje"
  },
  {
    name: "Low-level Laser",
    description: "Avansert laserbehandling",
    url: "/tjenester/metoder/laser"
  },
  {
    name: "Shock Wave",
    description: "Sjokkbølgebehandling",
    url: "/tjenester/metoder/shock-wave"
  },
  {
    name: "PMST",
    description: "Pulserende magnetfeltterapi",
    url: "/tjenester/metoder/pmst"
  },
  {
    name: "PEMF",
    description: "Pulserende elektromagnetisk feltterapi",
    url: "/tjenester/metoder/pemf"
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
