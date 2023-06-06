export const musics_request_filed_check = {
  bpm: [201, 29, 180],
  tracks: [
    {
      role: "bass",
      instruments: ["bass"],
      is_primary: true,
    },
    {
      role: "drums",
      instruments: ["drums"],
      is_primary: true,
    },
  ],
};
export const musics_request_category_check = {
  genre: "cinematic",
  bpm: [32, 150],
  keys: ["cmajor", "dminor"],
  time_signatures: ["3/4", "4/4", "4/8"],
  tracks: [
    {
      role: "main",
      instruments: ["piano", "trumpet"],
      is_primary: false,
    },
    {
      role: "sub",
      instruments: ["piano"],
      is_primary: false,
    },
    {
      role: "bass",
      instruments: ["bass"],
      is_primary: true,
    },
    {
      role: "drums",
      instruments: ["drums"],
      is_primary: false,
    },
  ],
};

export const musics_correct_request = {
  genre: "cinematic",
  bpm: [32, 150],
  keys: ["cmajor", "aminor"],
  time_signatures: ["3/4", "4/4"],
  tracks: [
    {
      role: "main",
      instruments: ["piano", "guitar"],
      is_primary: false,
    },
    {
      role: "sub",
      instruments: ["piano"],
      is_primary: false,
    },
    {
      role: "bass",
      instruments: ["bass"],
      is_primary: true,
    },
    {
      role: "drums",
      instruments: ["drums"],
      is_primary: false,
    },
  ],
};

export const samples_response = {
  total: 50,
  items: [
    {
      id: 1055,
      genre: "cinematic",
      role: "main",
      instrument: "guitar",
      key: "aminor",
      time_signature: "3/4",
      bpm: 70,
    },
    {
      id: 1056,
      genre: "cinematic",
      role: "main",
      instrument: "guitar",
      key: "aminor",
      time_signature: "3/4",
      bpm: 70,
    },
  ],
  has_next: false,
  has_prev: true,
};

export const categories = {
  total: 17,
  items: [
    {
      id: 1,
      type: "genre",
      name: "cinematic",
    },
    {
      id: 2,
      type: "genre",
      name: "rock",
    },
    {
      id: 3,
      type: "genre",
      name: "hiphop",
    },
    {
      id: 4,
      type: "genre",
      name: "edm",
    },
    {
      id: 1,
      type: "instrument",
      name: "piano",
    },
    {
      id: 2,
      type: "instrument",
      name: "drums",
    },
    {
      id: 3,
      type: "instrument",
      name: "bass",
    },
    {
      id: 4,
      type: "instrument",
      name: "guitar",
    },
    {
      id: 1,
      type: "role",
      name: "main",
    },
    {
      id: 2,
      type: "role",
      name: "sub",
    },
    {
      id: 3,
      type: "role",
      name: "bass",
    },
    {
      id: 4,
      type: "role",
      name: "drums",
    },
    {
      id: 1,
      type: "key",
      name: "cmajor",
    },
    {
      id: 2,
      type: "key",
      name: "aminor",
    },
    {
      id: 1,
      type: "time_signature",
      name: "3/4",
    },
    {
      id: 2,
      type: "time_signature",
      name: "4/4",
    },
    {
      id: 3,
      type: "time_signature",
      name: "6/8",
    },
  ],
  has_next: false,
  has_prev: false,
};
