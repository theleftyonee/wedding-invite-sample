/**
 * Wedding Configuration
 *
 * All editable wedding content lives here.
 * Replace placeholder values with real details before going live.
 *
 * All values below are SAMPLE / PLACEHOLDER data only.
 * They do not represent any real person, event, or venue.
 * Photographs are editorial studies of architecture, flowers, and tables.
 */

export interface WeddingEvent {
  readonly name: string;
  readonly date: string;
  readonly time: string;
  readonly startsAt: string;
  readonly durationHours: number;
  readonly venue: string;
  readonly dressCode: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly themeColor: "sage" | "burgundy" | "champagne" | "ink";
}

export interface GalleryStill {
  readonly src: string;
  readonly alt: string;
}

export interface StoryMark {
  readonly label: string;
  readonly title: string;
  readonly text: string;
  readonly image: string;
  readonly imageAlt: string;
}

export interface WeddingConfig {
  readonly couple: {
    readonly partner1: {
      readonly firstName: string;
      readonly lastName: string;
      readonly initial: string;
    };
    readonly partner2: {
      readonly firstName: string;
      readonly lastName: string;
      readonly initial: string;
    };
  };

  readonly ceremony: {
    readonly date: string;
    readonly displayDate: string;
    readonly venue: string;
    readonly city: string;
    readonly fullAddress: string;
    readonly mapUrl: string;
  };

  readonly copy: {
    readonly openingLine: string;
    readonly invitationText: string;
    readonly tagline: string;
    readonly welcomeKicker: string;
    readonly welcomeHeading: string;
    readonly welcomeScript: string;
    readonly welcomeText: string;
    readonly celebrationsKicker: string;
    readonly celebrationsHeading: string;
    readonly celebrationsText: string;
    readonly venueKicker: string;
    readonly venueHeading: string;
    readonly venueText: string;
    readonly galleryKicker: string;
    readonly galleryHeading: string;
    readonly galleryText: string;
    readonly rsvpKicker: string;
    readonly rsvpHeading: string;
    readonly rsvpText: string;
    readonly closingKicker: string;
    readonly closingHeading: string;
    readonly closingText: string;
    readonly atmosphereNote: string;
  };

  readonly events: readonly WeddingEvent[];

  readonly story: readonly StoryMark[];

  readonly guestInfo: {
    readonly accommodation: string;
    readonly travel: string;
    readonly dressCode: string;
  };

  readonly gallery: readonly GalleryStill[];

  readonly contact: {
    readonly name: string;
    readonly phone: string;
    readonly email: string;
  };

  readonly rsvp: {
    readonly deadline: string;
    readonly maxGuestsPerInvitation: number;
    readonly formEndpoint?: string;
  };

  readonly links: {
    readonly livestream: string;
    readonly registry: string;
    readonly accommodation: string;
  };

  readonly images: {
    readonly hero: string;
    readonly heroAlt: string;
    readonly welcome: string;
    readonly welcomeAlt: string;
    readonly venue: string;
    readonly venueAlt: string;
    readonly closing: string;
    readonly closingAlt: string;
  };
}

const weddingConfig: WeddingConfig = {
  couple: {
    partner1: {
      firstName: "Aanya",
      lastName: "Kapoor",
      initial: "A",
    },
    partner2: {
      firstName: "Arjun",
      lastName: "Singh",
      initial: "A",
    },
  },

  ceremony: {
    date: "2026-12-13T16:30:00+05:30",
    displayDate: "Sunday, 13 December 2026",
    venue: "Venue to be confirmed",
    city: "City to be confirmed",
    fullAddress: "Address to be confirmed",
    mapUrl: "",
  },

  copy: {
    openingLine: "Together with their families",
    invitationText:
      "request the pleasure of your company at the celebration of their marriage",
    tagline: "Two souls, one journey",
    welcomeKicker: "With love",
    welcomeHeading: "Welcome",
    welcomeScript: "Together, we celebrate",
    welcomeText:
      "With gratitude for the love that has carried us here, we welcome you into these days of colour, music, and blessing.",
    celebrationsKicker: "The celebrations",
    celebrationsHeading: "Our wedding events",
    celebrationsText:
      "Four gatherings, from colour and music to the vows and the feast.",
    venueKicker: "The gathering place",
    venueHeading: "Our wedding venue",
    venueText:
      "Water, stone, and evening light. The address will be shared when it is confirmed.",
    galleryKicker: "A quiet look",
    galleryHeading: "A few moments",
    galleryText:
      "Flowers, arches, and lamplight. These studies will give way to personal photographs.",
    rsvpKicker: "Kindly reply",
    rsvpHeading: "Will you join us?",
    rsvpText:
      "Your presence would honour these days. Tell us, when you can, whether you will be among us.",
    closingKicker: "With all our hearts",
    closingHeading: "Thank you",
    closingText:
      "We are grateful you would share in this beginning.",
    atmosphereNote:
      "Editorial studies only. These images are not photographs of the couple or the venue.",
  },

  events: [
    {
      name: "Mehendi",
      date: "Friday, 11 December 2026",
      time: "2:00 in the afternoon",
      startsAt: "2026-12-11T14:00:00+05:30",
      durationHours: 4,
      venue: "TO BE CONFIRMED",
      dressCode: "Bright florals and joyful colour",
      description: "An afternoon of colour, laughter, and the old rites of the hands.",
      image: "/images/events/mehendi.jpg",
      imageAlt: "An empty courtyard dressed with marigold canopies, cushions, and brass trays",
      themeColor: "sage",
    },
    {
      name: "Sangeet",
      date: "Saturday, 12 December 2026",
      time: "7:30 in the evening",
      startsAt: "2026-12-12T19:30:00+05:30",
      durationHours: 4,
      venue: "TO BE CONFIRMED",
      dressCode: "Festive evening wear",
      description: "An evening of music, dancing, and the families in one room.",
      image: "/images/events/sangeet.jpg",
      imageAlt: "An unoccupied courtyard stage with silk drapes, string lights, and instruments",
      themeColor: "burgundy",
    },
    {
      name: "Wedding Ceremony",
      date: "Sunday, 13 December 2026",
      time: "4:30 in the afternoon",
      startsAt: "2026-12-13T16:30:00+05:30",
      durationHours: 3,
      venue: "TO BE CONFIRMED",
      dressCode: "Traditional ceremony attire",
      description: "The vows, spoken with both families beside us.",
      image: "/images/events/wedding-ceremony.jpg",
      imageAlt: "A floral mandap beneath a stone arch, with oil lamps and no guests",
      themeColor: "champagne",
    },
    {
      name: "Reception",
      date: "Sunday, 13 December 2026",
      time: "8:00 in the evening",
      startsAt: "2026-12-13T20:00:00+05:30",
      durationHours: 4,
      venue: "TO BE CONFIRMED",
      dressCode: "Black tie, or festive evening dress",
      description: "A long supper, and the night kept open for everyone we love.",
      image: "/images/events/reception.jpg",
      imageAlt: "A candlelit table set for a feast inside a vaulted hall",
      themeColor: "ink",
    },
  ],

  story: [
    {
      label: "Sample",
      title: "A first chapter",
      text: "Sample placeholder. Replace this with a moment you want guests to know.",
      image: "/images/gallery/2.jpg",
      imageAlt: "Brass lanterns lined along a stone terrace at sunset",
    },
    {
      label: "Sample",
      title: "The promise",
      text: "Sample placeholder. A date and a sentence belong here when you are ready.",
      image: "/images/gallery/1.jpg",
      imageAlt: "Marigold and rose garlands against carved sandstone",
    },
    {
      label: "Sample",
      title: "These days",
      text: "Sample placeholder. The celebrations below are the only dates configured so far.",
      image: "/images/gallery/3.jpg",
      imageAlt: "A scalloped arch of bougainvillea opening onto a courtyard fountain",
    },
  ],

  guestInfo: {
    accommodation: "TO BE CONFIRMED",
    travel: "TO BE CONFIRMED",
    dressCode: "Festive and traditional, in jewel tones",
  },

  gallery: [
    {
      src: "/images/gallery/1.jpg",
      alt: "Marigold and rose garlands against carved sandstone",
    },
    {
      src: "/images/gallery/2.jpg",
      alt: "Brass lanterns lined along a stone terrace at sunset",
    },
    {
      src: "/images/gallery/3.jpg",
      alt: "A scalloped arch of bougainvillea opening onto a courtyard fountain",
    },
    {
      src: "/images/gallery/4.jpg",
      alt: "A long candlelit banquet table in a columned hall",
    },
  ],

  contact: {
    name: "TO BE CONFIRMED",
    phone: "TO BE CONFIRMED",
    email: "TO BE CONFIRMED",
  },

  rsvp: {
    deadline: "TO BE CONFIRMED",
    maxGuestsPerInvitation: 2,
    formEndpoint: "",
  },

  links: {
    livestream: "",
    registry: "",
    accommodation: "",
  },

  images: {
    hero: "/assets/hero_arch.jpg",
    heroAlt: "A flower-covered sandstone arch opening onto a lake at sunset",
    welcome: "/assets/welcome_scene.jpg",
    welcomeAlt: "Lanterns and flower garlands along a carved stone colonnade",
    venue: "/images/venue.jpg",
    venueAlt: "A sandstone palace reflected in a lake at dusk, shown as an editorial study",
    closing: "/assets/closing_night.jpg",
    closingAlt: "Oil lamps floating on a lake in front of a palace at night",
  },
};

export default weddingConfig;
