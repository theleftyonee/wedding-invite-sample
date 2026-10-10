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
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly time: string;
  readonly startsAt: string;
  readonly durationHours: number;
  readonly venue: string;
  readonly dressCode: string;
  readonly dressNote: string;
  readonly palette: readonly string[];
  readonly attireWomen: string;
  readonly attireMen: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly experience: readonly GalleryStill[];
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

  readonly audio: string;

  readonly images: {
    readonly hero: string;
    readonly heroVideo: string;
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
    celebrationsHeading: "Our Wedding Events",
    celebrationsText: "Four celebrations, a lifetime of memories.",
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
      id: "mehendi",
      name: "Mehendi",
      date: "Friday, 11 December 2026",
      time: "2:00 in the afternoon",
      startsAt: "2026-12-11T14:00:00+05:30",
      durationHours: 4,
      venue: "TO BE CONFIRMED",
      dressCode: "Bright florals and joyful colour",
      dressNote: "A suggestion, not a requirement. Botanical greens, sage, and marigold tones.",
      palette: ["#737A60", "#C4A35A", "#6C2938", "#E7D7C4"],
      attireWomen: "A colourful suit or lehenga, with room to sit and laugh.",
      attireMen: "A light kurta, in sage, ivory, or soft gold.",
      description: "An afternoon of colour, laughter, and the old rites of the hands.",
      image: "/images/events/mehendi.jpg",
      imageAlt: "An empty courtyard dressed with marigold canopies, cushions, and brass trays",
      experience: [
        { src: "/images/gallery/1.jpg", alt: "Marigold and rose garlands against carved sandstone" },
        { src: "/images/events/mehendi.jpg", alt: "An empty courtyard dressed with marigold canopies, cushions, and brass trays" },
      ],
      themeColor: "sage",
    },
    {
      id: "sangeet",
      name: "Sangeet",
      date: "Saturday, 12 December 2026",
      time: "7:30 in the evening",
      startsAt: "2026-12-12T19:30:00+05:30",
      durationHours: 4,
      venue: "TO BE CONFIRMED",
      dressCode: "Festive evening wear",
      dressNote: "A suggestion, not a requirement. Jewel tones, with burgundy, emerald, or gold.",
      palette: ["#6C2938", "#1A1613", "#B39765", "#2F4A3C"],
      attireWomen: "An evening suit or gown that can move on a dance floor.",
      attireMen: "A bandhgala, or a dark kurta with a polished shoe.",
      description: "An evening of music, dancing, and the families in one room.",
      image: "/images/events/sangeet.jpg",
      imageAlt: "An unoccupied courtyard stage with silk drapes, string lights, and instruments",
      experience: [
        { src: "/images/events/sangeet.jpg", alt: "An unoccupied courtyard stage with silk drapes, string lights, and instruments" },
        { src: "/images/gallery/2.jpg", alt: "Brass lanterns lined along a stone terrace at sunset" },
      ],
      themeColor: "burgundy",
    },
    {
      id: "ceremony",
      name: "Wedding Ceremony",
      date: "Sunday, 13 December 2026",
      time: "4:30 in the afternoon",
      startsAt: "2026-12-13T16:30:00+05:30",
      durationHours: 3,
      venue: "TO BE CONFIRMED",
      dressCode: "Traditional ceremony attire",
      dressNote: "A suggestion, not a requirement. Traditional Punjabi attire in ivory, champagne, or blush.",
      palette: ["#F7F2E9", "#D4C3A3", "#6C2938", "#C4A7A0"],
      attireWomen: "A traditional suit or saree, in ivory, champagne, or a quiet floral.",
      attireMen: "A sherwani, or a kurta with a stole.",
      description: "The vows, spoken with both families beside us.",
      image: "/images/events/wedding-ceremony.jpg",
      imageAlt: "A floral mandap beneath a stone arch, with oil lamps and no guests",
      experience: [
        { src: "/images/events/wedding-ceremony.jpg", alt: "A floral mandap beneath a stone arch, with oil lamps and no guests" },
        { src: "/images/gallery/3.jpg", alt: "A scalloped arch of bougainvillea opening onto a courtyard fountain" },
      ],
      themeColor: "champagne",
    },
    {
      id: "reception",
      name: "Reception",
      date: "Sunday, 13 December 2026",
      time: "8:00 in the evening",
      startsAt: "2026-12-13T20:00:00+05:30",
      durationHours: 4,
      venue: "TO BE CONFIRMED",
      dressCode: "Black tie, or festive evening dress",
      dressNote: "A suggestion, not a requirement. Black tie, Indian formal, or refined evening dress.",
      palette: ["#29251F", "#B39765", "#F7F2E9", "#6C2938"],
      attireWomen: "A dark evening gown, or a formal saree.",
      attireMen: "A black bandhgala, or a dinner suit.",
      description: "A long supper, and the night kept open for everyone we love.",
      image: "/images/events/reception.jpg",
      imageAlt: "A candlelit table set for a feast inside a vaulted hall",
      experience: [
        { src: "/images/events/reception.jpg", alt: "A candlelit table set for a feast inside a vaulted hall" },
        { src: "/images/gallery/4.jpg", alt: "A long candlelit banquet table in a columned hall" },
      ],
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

  audio: "/assets/wedding-audio.mp3",

  images: {
    hero: "/assets/wedding-video-poster.jpg",
    heroVideo: "/assets/wedding-video.mp4",
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
