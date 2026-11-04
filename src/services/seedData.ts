import {
  Ward,
  Van,
  Driver,
  AttendanceRecord,
  AlertItem,
  AuditLogEntry,
  SettingsConfig,
  Route,
  Trip,
  Complaint,
  Rating,
  Notice,
  Staff
} from '../types';

// Dynamic Date & Time Helpers
const NOW = Date.now();
const minutesAgo = (m: number) => new Date(NOW - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(NOW - h * 3600 * 1000).toISOString();
const daysAgoStr = (days: number) => {
  const dt = new Date(NOW - days * 86400 * 1000);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const formatAuditTime = (ageMinutes: number) => {
  if (ageMinutes < 720) {
    const dt = new Date(NOW - ageMinutes * 60 * 1000);
    return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
  }
  return 'Yesterday';
};
const formatAlertTimeAgo = (ageMinutes: number) => {
  if (ageMinutes < 60) return `${ageMinutes} min ago`;
  const hr = Math.floor(ageMinutes / 60);
  return `${hr} hr ago`;
};
const makeTicketId = (createdAtIso: string, num: string) => {
  const ymd = createdAtIso.slice(0, 10).replace(/-/g, '');
  return `PMH-${ymd}-${num}`;
};

// 1. WARDS (16 Godhra Wards W01..W16)
export const SEED_WARDS: Ward[] = [
  {
    "id": "W01",
    "name": "Ward 1 - Vohrawad",
    "nameGu": "વોર્ડ 1 - વોહરાવાડ",
    "code": "GD-W01",
    "type": "urban",
    "center": {
      "lat": 22.785,
      "lng": 73.61
    },
    "radiusM": 520,
    "routeId": "RT-GDR-01",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.85,
    "pointsCount": 6,
    "polygon": [
      [
        22.785541,
        73.614919
      ],
      [
        22.78908,
        73.613157
      ],
      [
        22.789247,
        73.606866
      ],
      [
        22.785227,
        73.605265
      ],
      [
        22.7803,
        73.607248
      ],
      [
        22.781167,
        73.612382
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W02",
    "name": "Ward 2 - Raipur",
    "nameGu": "વોર્ડ 2 - રાયપુર",
    "code": "GD-W02",
    "type": "urban",
    "center": {
      "lat": 22.782,
      "lng": 73.617
    },
    "radiusM": 480,
    "routeId": "RT-GDR-01",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.72,
    "pointsCount": 6,
    "polygon": [
      [
        22.782824,
        73.621941
      ],
      [
        22.785231,
        73.61992
      ],
      [
        22.785804,
        73.613622
      ],
      [
        22.782594,
        73.612819
      ],
      [
        22.77754,
        73.61504
      ],
      [
        22.777831,
        73.618927
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W03",
    "name": "Ward 3 - Bhadrapura",
    "nameGu": "વોર્ડ 3 - ભદ્રાપુરા",
    "code": "GD-W03",
    "type": "urban",
    "center": {
      "lat": 22.779,
      "lng": 73.623
    },
    "radiusM": 460,
    "routeId": "RT-GDR-01",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.66,
    "pointsCount": 7,
    "polygon": [
      [
        22.779703,
        73.628006
      ],
      [
        22.781405,
        73.625877
      ],
      [
        22.783312,
        73.621049
      ],
      [
        22.781472,
        73.61931
      ],
      [
        22.776467,
        73.619237
      ],
      [
        22.774736,
        73.621036
      ],
      [
        22.776549,
        73.625995
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W04",
    "name": "Ward 4 - Sigra",
    "nameGu": "વોર્ડ 4 - સિગરા",
    "code": "GD-W04",
    "type": "urban",
    "center": {
      "lat": 22.776,
      "lng": 73.611
    },
    "radiusM": 540,
    "routeId": "RT-GDR-01",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.92,
    "pointsCount": 6,
    "polygon": [
      [
        22.77627,
        73.616971
      ],
      [
        22.779957,
        73.613902
      ],
      [
        22.780232,
        73.607744
      ],
      [
        22.776619,
        73.605254
      ],
      [
        22.771806,
        73.60914
      ],
      [
        22.770833,
        73.61319
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W05",
    "name": "Ward 5 - Navi Pole",
    "nameGu": "વોર્ડ 5 - નવી પોળ",
    "code": "GD-W05",
    "type": "urban",
    "center": {
      "lat": 22.774,
      "lng": 73.618
    },
    "radiusM": 430,
    "routeId": "RT-GDR-02",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.58,
    "pointsCount": 6,
    "polygon": [
      [
        22.773674,
        73.622559
      ],
      [
        22.777722,
        73.620044
      ],
      [
        22.777305,
        73.616072
      ],
      [
        22.773986,
        73.613231
      ],
      [
        22.770908,
        73.616169
      ],
      [
        22.770174,
        73.620133
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W06",
    "name": "Ward 6 - Rampura",
    "nameGu": "વોર્ડ 6 - રામપુરા",
    "code": "GD-W06",
    "type": "urban",
    "center": {
      "lat": 22.771,
      "lng": 73.625
    },
    "radiusM": 500,
    "routeId": "RT-GDR-02",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.79,
    "pointsCount": 5,
    "polygon": [
      [
        22.770257,
        73.629824
      ],
      [
        22.776034,
        73.625883
      ],
      [
        22.773721,
        73.621948
      ],
      [
        22.767545,
        73.620984
      ],
      [
        22.766503,
        73.626054
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W07",
    "name": "Ward 7 - Lakhana",
    "nameGu": "વોર્ડ 7 - લખાણા",
    "code": "GD-W07",
    "type": "urban",
    "center": {
      "lat": 22.768,
      "lng": 73.612
    },
    "radiusM": 470,
    "routeId": "RT-GDR-02",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.69,
    "pointsCount": 6,
    "polygon": [
      [
        22.767356,
        73.616014
      ],
      [
        22.772527,
        73.613763
      ],
      [
        22.771937,
        73.610478
      ],
      [
        22.767199,
        73.607207
      ],
      [
        22.76442,
        73.608759
      ],
      [
        22.76497,
        73.614697
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W08",
    "name": "Ward 8 - Bhuravav",
    "nameGu": "વોર્ડ 8 - ભુરાવાવ",
    "code": "GD-W08",
    "type": "urban",
    "center": {
      "lat": 22.765,
      "lng": 73.62
    },
    "radiusM": 450,
    "routeId": "RT-GDR-03",
    "inspectorId": "STF-INS-01",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.64,
    "pointsCount": 6,
    "polygon": [
      [
        22.764639,
        73.624147
      ],
      [
        22.769053,
        73.621898
      ],
      [
        22.769052,
        73.618198
      ],
      [
        22.76442,
        73.61582
      ],
      [
        22.761422,
        73.61684
      ],
      [
        22.76215,
        73.622566
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W09",
    "name": "Ward 9 - Prabhu Nagar",
    "nameGu": "વોર્ડ 9 - પ્રભુ નગર",
    "code": "GD-W09",
    "type": "urban",
    "center": {
      "lat": 22.782,
      "lng": 73.63
    },
    "radiusM": 490,
    "routeId": "RT-GDR-03",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.75,
    "pointsCount": 7,
    "polygon": [
      [
        22.78214,
        73.635025
      ],
      [
        22.78544,
        73.632993
      ],
      [
        22.7869,
        73.628906
      ],
      [
        22.783516,
        73.626158
      ],
      [
        22.780163,
        73.625015
      ],
      [
        22.777512,
        73.629357
      ],
      [
        22.778142,
        73.632613
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W10",
    "name": "Ward 10 - Kankunaka",
    "nameGu": "વોર્ડ 10 - કાંકુનાકા",
    "code": "GD-W10",
    "type": "urban",
    "center": {
      "lat": 22.778,
      "lng": 73.636
    },
    "radiusM": 410,
    "routeId": "RT-GDR-03",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.53,
    "pointsCount": 6,
    "polygon": [
      [
        22.778575,
        73.640432
      ],
      [
        22.780613,
        73.638126
      ],
      [
        22.7814,
        73.633347
      ],
      [
        22.778293,
        73.632054
      ],
      [
        22.774501,
        73.634093
      ],
      [
        22.774401,
        73.638084
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W11",
    "name": "Ward 11 - Godhra GIDC",
    "nameGu": "વોર્ડ 11 - ગોધરા જીઆઈડીસી",
    "code": "GD-W11",
    "type": "urban",
    "center": {
      "lat": 22.772,
      "lng": 73.642
    },
    "radiusM": 700,
    "routeId": "RT-GDR-04",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 1.54,
    "pointsCount": 8,
    "polygon": [
      [
        22.773287,
        73.649646
      ],
      [
        22.775435,
        73.64735
      ],
      [
        22.77875,
        73.640716
      ],
      [
        22.777566,
        73.637714
      ],
      [
        22.771066,
        73.635535
      ],
      [
        22.767676,
        73.635792
      ],
      [
        22.766243,
        73.642769
      ],
      [
        22.766583,
        73.646755
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W12",
    "name": "Ward 12 - Station Road",
    "nameGu": "વોર્ડ 12 - સ્ટેશન રોડ",
    "code": "GD-W12",
    "type": "urban",
    "center": {
      "lat": 22.77,
      "lng": 73.63
    },
    "radiusM": 380,
    "routeId": "RT-GDR-04",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.45,
    "pointsCount": 6,
    "polygon": [
      [
        22.770499,
        73.634062
      ],
      [
        22.772835,
        73.632434
      ],
      [
        22.772642,
        73.62767
      ],
      [
        22.77066,
        73.625865
      ],
      [
        22.767165,
        73.628894
      ],
      [
        22.76638,
        73.6314
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W13",
    "name": "Ward 13 - Dahod Road",
    "nameGu": "વોર્ડ 13 - દાહોદ રોડ",
    "code": "GD-W13",
    "type": "urban",
    "center": {
      "lat": 22.76,
      "lng": 73.628
    },
    "radiusM": 560,
    "routeId": "RT-GDR-04",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 0.99,
    "pointsCount": 6,
    "polygon": [
      [
        22.760099,
        73.633611
      ],
      [
        22.764778,
        73.631292
      ],
      [
        22.763687,
        73.625322
      ],
      [
        22.760521,
        73.621842
      ],
      [
        22.755393,
        73.625828
      ],
      [
        22.75507,
        73.630206
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W14",
    "name": "Ward 14 - Shehra Road",
    "nameGu": "વોર્ડ 14 - શેરા રોડ",
    "code": "GD-W14",
    "type": "rural",
    "center": {
      "lat": 22.79,
      "lng": 73.618
    },
    "radiusM": 640,
    "routeId": "RT-GDR-05",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 1.29,
    "pointsCount": 6,
    "polygon": [
      [
        22.789454,
        73.6237
      ],
      [
        22.795942,
        73.62104
      ],
      [
        22.794947,
        73.615314
      ],
      [
        22.789792,
        73.611252
      ],
      [
        22.784599,
        73.614568
      ],
      [
        22.785181,
        73.620886
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W15",
    "name": "Ward 15 - Halol Road",
    "nameGu": "વોર્ડ 15 - હાલોલ રોડ",
    "code": "GD-W15",
    "type": "rural",
    "center": {
      "lat": 22.766,
      "lng": 73.605
    },
    "radiusM": 610,
    "routeId": "RT-GDR-05",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 1.17,
    "pointsCount": 7,
    "polygon": [
      [
        22.765119,
        73.610393
      ],
      [
        22.771313,
        73.608184
      ],
      [
        22.771818,
        73.604567
      ],
      [
        22.76765,
        73.599387
      ],
      [
        22.76401,
        73.59861
      ],
      [
        22.761168,
        73.604371
      ],
      [
        22.76088,
        73.608707
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  },
  {
    "id": "W16",
    "name": "Ward 16 - Kalol Road",
    "nameGu": "વોર્ડ 16 - કાલોલ રોડ",
    "code": "GD-W16",
    "type": "rural",
    "center": {
      "lat": 22.788,
      "lng": 73.63
    },
    "radiusM": 590,
    "routeId": "RT-GDR-06",
    "inspectorId": "STF-INS-02",
    "escalationTo": "STF-CO-01",
    "areaKm2": 1.09,
    "pointsCount": 6,
    "polygon": [
      [
        22.787125,
        73.635848
      ],
      [
        22.793114,
        73.632038
      ],
      [
        22.793623,
        73.627804
      ],
      [
        22.787168,
        73.625052
      ],
      [
        22.783403,
        73.625793
      ],
      [
        22.783928,
        73.633696
      ]
    ],
    "createdDate": "12 Jun 2026",
    "createdBy": "Shri R. K. Patel",
    "history": [
      {
        "date": "12 Jun 2026",
        "action": "Created by R. K. Patel"
      },
      {
        "date": "02 Aug 2026",
        "action": "Boundary edited"
      },
      {
        "date": "14 Sep 2026",
        "action": "Inspector assigned"
      }
    ]
  }
];

// 2. ROUTES (6 Routes RT-GDR-01..06)
export const SEED_ROUTES: Route[] = [
  {
    "id": "RT-GDR-01",
    "name": "Morning North",
    "wardIds": [
      "W01",
      "W02",
      "W03",
      "W04"
    ],
    "scheduledStartTime": "07:00",
    "vanPlate": "GJ-17-GV-2401",
    "totalDistanceKm": 2.8,
    "estimatedDuration": "0 h 59 min"
  },
  {
    "id": "RT-GDR-02",
    "name": "Morning Central",
    "wardIds": [
      "W05",
      "W06",
      "W07"
    ],
    "scheduledStartTime": "07:30",
    "vanPlate": "GJ-17-GV-2402",
    "totalDistanceKm": 2.2,
    "estimatedDuration": "0 h 45 min"
  },
  {
    "id": "RT-GDR-03",
    "name": "Morning East",
    "wardIds": [
      "W08",
      "W09",
      "W10"
    ],
    "scheduledStartTime": "08:00",
    "vanPlate": "GJ-17-GV-2403",
    "totalDistanceKm": 2.9,
    "estimatedDuration": "0 h 48 min"
  },
  {
    "id": "RT-GDR-04",
    "name": "Morning South",
    "wardIds": [
      "W11",
      "W12",
      "W13"
    ],
    "scheduledStartTime": "08:30",
    "vanPlate": "GJ-17-GV-2404",
    "totalDistanceKm": 2.4,
    "estimatedDuration": "0 h 46 min"
  },
  {
    "id": "RT-GDR-05",
    "name": "Outer North",
    "wardIds": [
      "W14",
      "W15"
    ],
    "scheduledStartTime": "09:00",
    "vanPlate": "GJ-17-GV-2405",
    "totalDistanceKm": 3,
    "estimatedDuration": "0 h 36 min"
  },
  {
    "id": "RT-GDR-06",
    "name": "Outer East",
    "wardIds": [
      "W16"
    ],
    "scheduledStartTime": "09:30",
    "vanPlate": "GJ-17-GV-2406",
    "totalDistanceKm": 0,
    "estimatedDuration": "0 h 12 min"
  }
];

// 3. VANS (6 Vans VAN-01..06)
export const SEED_VANS: Van[] = [
  {
    id: "VAN-01",
    plateNo: "GJ-17-GV-2401",
    routeId: "RT-GDR-01",
    status: "on_shift",
    lastLocation: {
      lat: 22.7772,
      lng: 73.6135,
      speedKmph: 18,
      updatedAt: minutesAgo(1)
    },
    batteryPct: 78,
    type: "Tata Ace",
    capacity: "750 kg",
    driverId: "DR-1001",
    driverName: "Rameshbhai B. Solanki",
    insuranceExpiry: "2027-03-31",
    pucExpiry: "2026-11-13",
    currentTripId: "TRIP-20261103-01"
  },
  {
    id: "VAN-02",
    plateNo: "GJ-17-GV-2402",
    routeId: "RT-GDR-02",
    status: "on_shift",
    lastLocation: {
      lat: 22.7725,
      lng: 73.6205,
      speedKmph: 12,
      updatedAt: minutesAgo(2)
    },
    batteryPct: 64,
    type: "Mahindra Jeeto",
    capacity: "700 kg",
    driverId: "DR-1002",
    driverName: "Kiranbhai J. Patel",
    insuranceExpiry: "2027-06-30",
    pucExpiry: "2027-01-20",
    currentTripId: "TRIP-20261103-02"
  },
  {
    id: "VAN-03",
    plateNo: "GJ-17-GV-2403",
    routeId: "RT-GDR-03",
    status: "on_shift",
    lastLocation: {
      lat: 22.7698,
      lng: 73.6225,
      speedKmph: 22,
      updatedAt: minutesAgo(1)
    },
    batteryPct: 91,
    type: "Tata Ace",
    capacity: "750 kg",
    driverId: "DR-1003",
    driverName: "Mehulbhai R. Chauhan",
    insuranceExpiry: "2026-12-15",
    pucExpiry: "2027-02-28",
    currentTripId: "TRIP-20261103-03"
  },
  {
    id: "VAN-04",
    plateNo: "GJ-17-GV-2404",
    routeId: "RT-GDR-04",
    status: "on_shift",
    lastLocation: {
      lat: 22.7708,
      lng: 73.6355,
      speedKmph: 9,
      updatedAt: minutesAgo(3)
    },
    batteryPct: 12,
    type: "Ashok Leyland Dost",
    capacity: "1250 kg",
    driverId: "DR-1004",
    driverName: "Sanjaybhai K. Parmar",
    insuranceExpiry: "2027-08-31",
    pucExpiry: "2026-12-05",
    currentTripId: "TRIP-20261103-04"
  },
  {
    id: "VAN-05",
    plateNo: "GJ-17-GV-2405",
    routeId: "RT-GDR-05",
    status: "idle",
    lastLocation: {
      lat: 22.7768,
      lng: 73.615,
      speedKmph: 0,
      updatedAt: minutesAgo(25)
    },
    batteryPct: 88,
    type: "Mahindra Jeeto",
    capacity: "700 kg",
    driverId: "DR-1005",
    driverName: "Dineshbhai S. Rathod",
    insuranceExpiry: "2027-01-31",
    pucExpiry: "2027-04-18"
  },
  {
    id: "VAN-06",
    plateNo: "GJ-17-GV-2406",
    routeId: "RT-GDR-06",
    status: "offline",
    lastLocation: {
      lat: 22.7872,
      lng: 73.6295,
      speedKmph: 0,
      updatedAt: minutesAgo(42)
    },
    batteryPct: 41,
    type: "Tata Intra",
    capacity: "1000 kg",
    driverId: "DR-1006",
    driverName: "Alpeshbhai V. Baria",
    insuranceExpiry: "2026-11-30",
    pucExpiry: "2027-03-09",
    currentTripId: "TRIP-20261103-06"
  }
];

// 4. DRIVERS (6 Drivers DR-1001..1006)
export const SEED_DRIVERS: Driver[] = [
  {
    id: "DR-1001",
    driverId: "DR-1001",
    name: "Rameshbhai B. Solanki",
    phone: "9825043241",
    dob: "1986-04-12",
    address: "22, Vohrawad, Godhra, Panchmahal 389001",
    emergencyContact: {"name":"Nileshbhai Solanki","phone":"9825043277"},
    licenceNumber: "GJ1720150001234",
    licenceClass: "LMV",
    licenceIssued: "2015-06-18",
    licenceValidUntil: "2027-06-17",
    vanId: "VAN-01",
    vanPlate: "GJ-17-GV-2401",
    wardIds: ["W01","W02","W03","W04"],
    shiftStart: "07:00",
    shiftEnd: "12:00",
    status: "on_shift",
    lateMinutes: 0,
    shiftProgressPct: 50,
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2024-06-01",
    oneTimePin: "4001",
    licencePhotoUrl: "drivers/DR-1001/licence.jpg",
    recentShifts: [
      {
        date: daysAgoStr(1),
        vanPlate: "GJ-17-GV-2401",
        started: "07:03",
        ended: "11:12",
        wardsDone: "4 of 4",
        status: "on_time"
      },
      {
        date: daysAgoStr(2),
        vanPlate: "GJ-17-GV-2401",
        started: "07:10",
        ended: "11:05",
        wardsDone: "4 of 4",
        status: "on_time"
      },
      {
        date: daysAgoStr(3),
        vanPlate: "GJ-17-GV-2401",
        started: "07:02",
        ended: "10:58",
        wardsDone: "4 of 4",
        status: "on_time"
      },
      {
        date: daysAgoStr(4),
        vanPlate: "GJ-17-GV-2401",
        started: "07:05",
        ended: "11:20",
        wardsDone: "4 of 4",
        status: "on_time"
      },
      {
        date: daysAgoStr(5),
        vanPlate: "GJ-17-GV-2401",
        started: "07:00",
        ended: "11:02",
        wardsDone: "4 of 4",
        status: "on_time"
      }
    ]
  },
  {
    id: "DR-1002",
    driverId: "DR-1002",
    name: "Kiranbhai J. Patel",
    phone: "9898013227",
    dob: "1990-11-03",
    address: "8, Rampura, Godhra, Panchmahal 389001",
    emergencyContact: {"name":"Jashvantbhai Patel","phone":"9898013219"},
    licenceNumber: "GJ1720120019876",
    licenceClass: "LMV",
    licenceIssued: "2012-02-09",
    licenceValidUntil: "2028-02-08",
    vanId: "VAN-02",
    vanPlate: "GJ-17-GV-2402",
    wardIds: ["W05","W06","W07"],
    shiftStart: "07:30",
    shiftEnd: "12:00",
    status: "on_shift",
    lateMinutes: 0,
    shiftProgressPct: 67,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2024-06-01",
    oneTimePin: "4002",
    licencePhotoUrl: "drivers/DR-1002/licence.jpg",
    recentShifts: [

    ]
  },
  {
    id: "DR-1003",
    driverId: "DR-1003",
    name: "Mehulbhai R. Chauhan",
    phone: "9879512363",
    dob: "1988-07-25",
    address: "31, Bhuravav, Godhra, Panchmahal 389001",
    emergencyContact: {"name":"Rakeshbhai Chauhan","phone":"9879512334"},
    licenceNumber: "GJ1720100004411",
    licenceClass: "LMV",
    licenceIssued: "2010-09-30",
    licenceValidUntil: "2026-09-29",
    vanId: "VAN-03",
    vanPlate: "GJ-17-GV-2403",
    wardIds: ["W08","W09","W10"],
    shiftStart: "08:00",
    shiftEnd: "13:00",
    status: "on_shift",
    lateMinutes: 0,
    shiftProgressPct: 33,
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2024-06-01",
    oneTimePin: "4003",
    licencePhotoUrl: "drivers/DR-1003/licence.jpg",
    recentShifts: [

    ]
  },
  {
    id: "DR-1004",
    driverId: "DR-1004",
    name: "Sanjaybhai K. Parmar",
    phone: "9904378215",
    dob: "1992-01-14",
    address: "5, GIDC Colony, Godhra, Panchmahal 389001",
    emergencyContact: {"name":"Kantabhai Parmar","phone":"9904378290"},
    licenceNumber: "GJ1720180023345",
    licenceClass: "LMV",
    licenceIssued: "2018-03-22",
    licenceValidUntil: "2029-03-21",
    vanId: "VAN-04",
    vanPlate: "GJ-17-GV-2404",
    wardIds: ["W11","W12","W13"],
    shiftStart: "08:30",
    shiftEnd: "13:00",
    status: "on_shift",
    lateMinutes: 0,
    shiftProgressPct: 0,
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2024-06-01",
    oneTimePin: "4004",
    licencePhotoUrl: "drivers/DR-1004/licence.jpg",
    recentShifts: [

    ]
  },
  {
    id: "DR-1005",
    driverId: "DR-1005",
    name: "Dineshbhai S. Rathod",
    phone: "9726889088",
    dob: "1984-09-08",
    address: "17, Shehra Road, Godhra, Panchmahal 389001",
    emergencyContact: {"name":"Sureshbhai Rathod","phone":"9726889061"},
    licenceNumber: "GJ1720080007766",
    licenceClass: "HMV",
    licenceIssued: "2008-12-01",
    licenceValidUntil: "2027-11-30",
    vanId: "VAN-05",
    vanPlate: "GJ-17-GV-2405",
    wardIds: ["W14","W15"],
    shiftStart: "09:00",
    shiftEnd: "14:00",
    status: "on_shift",
    lateMinutes: 0,
    shiftProgressPct: 0,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2024-06-01",
    oneTimePin: "4005",
    licencePhotoUrl: "drivers/DR-1005/licence.jpg",
    recentShifts: [

    ]
  },
  {
    id: "DR-1006",
    driverId: "DR-1006",
    name: "Alpeshbhai V. Baria",
    phone: "9426093552",
    dob: "1995-05-19",
    address: "44, Kalol Road, Godhra, Panchmahal 389001",
    emergencyContact: {"name":"Vijaybhai Baria","phone":"9426093528"},
    licenceNumber: "GJ1720200041122",
    licenceClass: "LMV",
    licenceIssued: "2020-07-15",
    licenceValidUntil: "2030-07-14",
    vanId: "VAN-06",
    vanPlate: "GJ-17-GV-2406",
    wardIds: ["W16"],
    shiftStart: "09:30",
    shiftEnd: "14:00",
    status: "on_shift",
    lateMinutes: 0,
    shiftProgressPct: 0,
    photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    joinedDate: "2024-06-01",
    oneTimePin: "4006",
    licencePhotoUrl: "drivers/DR-1006/licence.jpg",
    recentShifts: [

    ]
  }
];

// 5. STAFF (5 District & Municipal Staff)
export const SEED_STAFF: Staff[] = [
  {
    "id": "STF-DDO-01",
    "authUid": "uid_stf-ddo-01",
    "name": "Shri R. K. Patel",
    "role": "ddo",
    "wardIds": [
      "W01",
      "W02",
      "W03",
      "W04",
      "W05",
      "W06",
      "W07",
      "W08",
      "W09",
      "W10",
      "W11",
      "W12",
      "W13",
      "W14",
      "W15",
      "W16"
    ],
    "talukaId": "PMH",
    "phone": "9925043242",
    "email": "ddo.panchmahal@gujarat.gov.in",
    "jurisdiction": "Panchmahal District Administration",
    "lastActive": "Today, 10:12",
    "active": true
  },
  {
    "id": "STF-CO-01",
    "authUid": "uid_stf-co-01",
    "name": "Smt. M. J. Desai",
    "role": "chief_officer",
    "wardIds": [
      "W01",
      "W02",
      "W03",
      "W04",
      "W05",
      "W06",
      "W07",
      "W08",
      "W09",
      "W10",
      "W11",
      "W12",
      "W13",
      "W14",
      "W15",
      "W16"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9825091201",
    "email": "chief.officer.godhra@gujarat.gov.in",
    "jurisdiction": "Godhra Nagarpalika (16 Wards)",
    "lastActive": "Today, 10:05",
    "active": true
  },
  {
    "id": "STF-CO-02",
    "authUid": "uid_stf-co-02",
    "name": "Shri Rakesh B. Shah",
    "role": "chief_officer",
    "wardIds": [],
    "talukaId": "PMH-HAL",
    "phone": "9825091202",
    "email": "co.halol@gujarat.gov.in",
    "jurisdiction": "Halol Nagarpalika (12 Wards)",
    "lastActive": "Today, 09:40",
    "active": true
  },
  {
    "id": "STF-CO-03",
    "authUid": "uid_stf-co-03",
    "name": "Shri Paresh C. Mehta",
    "role": "chief_officer",
    "wardIds": [],
    "talukaId": "PMH-KAL",
    "phone": "9825091203",
    "email": "co.kalol@gujarat.gov.in",
    "jurisdiction": "Kalol Nagarpalika (10 Wards)",
    "lastActive": "Today, 09:25",
    "active": true
  },
  {
    "id": "STF-TDO-01",
    "authUid": "uid_stf-tdo-01",
    "name": "Shri S. N. Joshi",
    "role": "tdo",
    "wardIds": [],
    "talukaId": "PMH-GDR",
    "phone": "9925091204",
    "email": "tdo.godhra@gujarat.gov.in",
    "jurisdiction": "Godhra Rural Taluka (18 Gram Panchayats)",
    "lastActive": "Today, 10:05",
    "active": true
  },
  {
    "id": "STF-TDO-02",
    "authUid": "uid_stf-tdo-02",
    "name": "Shri Kiran M. Patel",
    "role": "tdo",
    "wardIds": [],
    "talukaId": "PMH-SHE",
    "phone": "9925091205",
    "email": "tdo.shehera@gujarat.gov.in",
    "jurisdiction": "Shehera Taluka (22 Gram Panchayats)",
    "lastActive": "Today, 08:50",
    "active": true
  },
  {
    "id": "STF-INS-01",
    "authUid": "uid_stf-ins-01",
    "name": "Smt. P. K. Rathod",
    "role": "inspector",
    "wardIds": [
      "W01",
      "W02",
      "W03",
      "W04",
      "W05",
      "W06",
      "W07",
      "W08"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093551",
    "email": "inspector.north.godhra@gujarat.gov.in",
    "jurisdiction": "Godhra NP (Ward 1 to Ward 8)",
    "lastActive": "Today, 10:05",
    "active": true
  },
  {
    "id": "STF-INS-02",
    "authUid": "uid_stf-ins-02",
    "name": "Shri M. S. Rana",
    "role": "inspector",
    "wardIds": [
      "W09",
      "W10",
      "W11",
      "W12",
      "W13",
      "W14",
      "W15",
      "W16"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093552",
    "email": "inspector.south.godhra@gujarat.gov.in",
    "jurisdiction": "Godhra NP (Ward 9 to Ward 16)",
    "lastActive": "Today, 10:05",
    "active": true
  },
  {
    "id": "STF-INS-03",
    "authUid": "uid_stf-ins-03",
    "name": "Shri Jayesh V. Solanki",
    "role": "inspector",
    "wardIds": [
      "W01",
      "W02"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093553",
    "email": "j.solanki@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Vohrawad & Raipur",
    "lastActive": "Today, 09:15",
    "active": true
  },
  {
    "id": "STF-INS-04",
    "authUid": "uid_stf-ins-04",
    "name": "Smt. Hetal D. Desai",
    "role": "inspector",
    "wardIds": [
      "W03",
      "W04"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093554",
    "email": "h.desai@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Bhadrapura & Sigra",
    "lastActive": "Today, 09:30",
    "active": true
  },
  {
    "id": "STF-INS-05",
    "authUid": "uid_stf-ins-05",
    "name": "Shri Bharat K. Baria",
    "role": "inspector",
    "wardIds": [
      "W05",
      "W06"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093555",
    "email": "b.baria@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Navi Pole & Rampura",
    "lastActive": "Today, 09:45",
    "active": true
  },
  {
    "id": "STF-INS-06",
    "authUid": "uid_stf-ins-06",
    "name": "Smt. Neeta R. Chauhan",
    "role": "inspector",
    "wardIds": [
      "W07",
      "W08"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093556",
    "email": "n.chauhan@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Lakhana & Bhuravav",
    "lastActive": "Today, 08:45",
    "active": true
  },
  {
    "id": "STF-INS-07",
    "authUid": "uid_stf-ins-07",
    "name": "Shri Nilesh T. Parmar",
    "role": "inspector",
    "wardIds": [
      "W09",
      "W10"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093557",
    "email": "n.parmar@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Prabhu Nagar & Kankunaka",
    "lastActive": "Today, 09:10",
    "active": true
  },
  {
    "id": "STF-INS-08",
    "authUid": "uid_stf-ins-08",
    "name": "Shri Dinesh H. Vaja",
    "role": "inspector",
    "wardIds": [
      "W11",
      "W12"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093558",
    "email": "d.vaja@godhranp.gov.in",
    "jurisdiction": "Godhra NP - GIDC & Station Road",
    "lastActive": "Today, 08:30",
    "active": true
  },
  {
    "id": "STF-INS-09",
    "authUid": "uid_stf-ins-09",
    "name": "Smt. Rekha M. Patel",
    "role": "inspector",
    "wardIds": [
      "W13",
      "W14"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093559",
    "email": "r.patel@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Dahod Road & Shehra Road",
    "lastActive": "Today, 09:20",
    "active": true
  },
  {
    "id": "STF-INS-10",
    "authUid": "uid_stf-ins-10",
    "name": "Shri Sanjay A. Shah",
    "role": "inspector",
    "wardIds": [
      "W15",
      "W16"
    ],
    "talukaId": "PMH-GDR",
    "phone": "9426093560",
    "email": "s.shah@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Halol Road & Kalol Road",
    "lastActive": "Today, 08:55",
    "active": true
  },
  {
    "id": "STF-INS-11",
    "authUid": "uid_stf-ins-11",
    "name": "Shri Pravin D. Rathod",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-HAL",
    "phone": "9426093561",
    "email": "p.rathod@halolnp.gov.in",
    "jurisdiction": "Halol NP - GIDC Phase 1 & 2",
    "lastActive": "Today, 09:00",
    "active": true
  },
  {
    "id": "STF-INS-12",
    "authUid": "uid_stf-ins-12",
    "name": "Smt. Meena S. Parmar",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-HAL",
    "phone": "9426093562",
    "email": "m.parmar@halolnp.gov.in",
    "jurisdiction": "Halol NP - Bus Stand & Bazaar",
    "lastActive": "Today, 09:40",
    "active": true
  },
  {
    "id": "STF-INS-13",
    "authUid": "uid_stf-ins-13",
    "name": "Shri Arvind G. Joshi",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-HAL",
    "phone": "9426093563",
    "email": "a.joshi@halolnp.gov.in",
    "jurisdiction": "Halol NP - Pavagadh Road Zone",
    "lastActive": "Today, 08:20",
    "active": true
  },
  {
    "id": "STF-INS-14",
    "authUid": "uid_stf-ins-14",
    "name": "Smt. Geeta B. Solanki",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-HAL",
    "phone": "9426093564",
    "email": "g.solanki@halolnp.gov.in",
    "jurisdiction": "Halol NP - Vadodara Bypass Zone",
    "lastActive": "Today, 09:15",
    "active": true
  },
  {
    "id": "STF-INS-15",
    "authUid": "uid_stf-ins-15",
    "name": "Shri Mahesh K. Rana",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-KAL",
    "phone": "9426093565",
    "email": "m.rana@kalolnp.gov.in",
    "jurisdiction": "Kalol NP - Station Road Ward",
    "lastActive": "Today, 09:35",
    "active": true
  },
  {
    "id": "STF-INS-16",
    "authUid": "uid_stf-ins-16",
    "name": "Shri Ashok N. Patel",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-KAL",
    "phone": "9426093566",
    "email": "a.patel@kalolnp.gov.in",
    "jurisdiction": "Kalol NP - GIDC Industrial Estate",
    "lastActive": "Today, 08:40",
    "active": true
  },
  {
    "id": "STF-INS-17",
    "authUid": "uid_stf-ins-17",
    "name": "Smt. Daksha V. Baria",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-KAL",
    "phone": "9426093567",
    "email": "d.baria@kalolnp.gov.in",
    "jurisdiction": "Kalol NP - Boru Road Ward",
    "lastActive": "Today, 09:05",
    "active": true
  },
  {
    "id": "STF-INS-18",
    "authUid": "uid_stf-ins-18",
    "name": "Shri Rajesh L. Chauhan",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-SHE",
    "phone": "9426093568",
    "email": "r.chauhan@panchmahal.gov.in",
    "jurisdiction": "Shehera Taluka - Central Village Cluster",
    "lastActive": "Today, 08:15",
    "active": true
  },
  {
    "id": "STF-INS-19",
    "authUid": "uid_stf-ins-19",
    "name": "Smt. Bhavna R. Vaja",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-SHE",
    "phone": "9426093569",
    "email": "b.vaja@panchmahal.gov.in",
    "jurisdiction": "Shehera Taluka - North Panchayat Zone",
    "lastActive": "Today, 08:45",
    "active": true
  },
  {
    "id": "STF-INS-20",
    "authUid": "uid_stf-ins-20",
    "name": "Shri Naresh P. Parmar",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-SHE",
    "phone": "9426093570",
    "email": "n.parmar@panchmahal.gov.in",
    "jurisdiction": "Shehera Taluka - South Lake Zone",
    "lastActive": "Today, 09:10",
    "active": true
  },
  {
    "id": "STF-INS-21",
    "authUid": "uid_stf-ins-21",
    "name": "Shri Hitesh S. Baria",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-GHO",
    "phone": "9426093571",
    "email": "h.baria@panchmahal.gov.in",
    "jurisdiction": "Ghoghamba Taluka - Main Bazaar Circle",
    "lastActive": "Today, 08:30",
    "active": true
  },
  {
    "id": "STF-INS-22",
    "authUid": "uid_stf-ins-22",
    "name": "Smt. Seema K. Joshi",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-GHO",
    "phone": "9426093572",
    "email": "s.joshi@panchmahal.gov.in",
    "jurisdiction": "Ghoghamba Taluka - Eastern Forest Border",
    "lastActive": "Today, 09:25",
    "active": true
  },
  {
    "id": "STF-INS-23",
    "authUid": "uid_stf-ins-23",
    "name": "Shri Vikram D. Solanki",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-GHO",
    "phone": "9426093573",
    "email": "v.solanki@panchmahal.gov.in",
    "jurisdiction": "Ghoghamba Taluka - Mining Cluster Zone",
    "lastActive": "Today, 07:50",
    "active": true
  },
  {
    "id": "STF-INS-24",
    "authUid": "uid_stf-ins-24",
    "name": "Shri Dilip M. Rathod",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-MOR",
    "phone": "9426093574",
    "email": "d.rathod@panchmahal.gov.in",
    "jurisdiction": "Morwa Hadaf - North Block",
    "lastActive": "Today, 08:50",
    "active": true
  },
  {
    "id": "STF-INS-25",
    "authUid": "uid_stf-ins-25",
    "name": "Smt. Urmila N. Patel",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-MOR",
    "phone": "9426093575",
    "email": "u.patel@panchmahal.gov.in",
    "jurisdiction": "Morwa Hadaf - South Panchayat Hub",
    "lastActive": "Today, 09:15",
    "active": true
  },
  {
    "id": "STF-INS-26",
    "authUid": "uid_stf-ins-26",
    "name": "Shri Rameshwar C. Baria",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-MOR",
    "phone": "9426093576",
    "email": "r.baria@panchmahal.gov.in",
    "jurisdiction": "Morwa Hadaf - Station Environs",
    "lastActive": "Today, 08:10",
    "active": true
  },
  {
    "id": "STF-INS-27",
    "authUid": "uid_stf-ins-27",
    "name": "Shri Jignesh A. Shah",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-JAM",
    "phone": "9426093577",
    "email": "j.shah@panchmahal.gov.in",
    "jurisdiction": "Jambughoda Taluka - Eco Sanctuary Ring",
    "lastActive": "Today, 09:05",
    "active": true
  },
  {
    "id": "STF-INS-28",
    "authUid": "uid_stf-ins-28",
    "name": "Smt. Shila H. Chauhan",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-JAM",
    "phone": "9426093578",
    "email": "s.chauhan@panchmahal.gov.in",
    "jurisdiction": "Jambughoda Taluka - Heritage Corridor",
    "lastActive": "Today, 08:40",
    "active": true
  },
  {
    "id": "STF-INS-29",
    "authUid": "uid_stf-ins-29",
    "name": "Shri Kamlesh F. Vaja",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-KHA",
    "phone": "9426093579",
    "email": "k.vaja@panchmahal.gov.in",
    "jurisdiction": "Khanpur Taluka - Kadana Link Road",
    "lastActive": "Today, 09:00",
    "active": true
  },
  {
    "id": "STF-INS-30",
    "authUid": "uid_stf-ins-30",
    "name": "Smt. Manjula P. Parmar",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-KHA",
    "phone": "9426093580",
    "email": "m.parmar@panchmahal.gov.in",
    "jurisdiction": "Khanpur Taluka - Central Market Ward",
    "lastActive": "Today, 08:25",
    "active": true
  },
  {
    "id": "STF-INS-31",
    "authUid": "uid_stf-ins-31",
    "name": "Shri Tarun B. Desai",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-GDR",
    "phone": "9426093581",
    "email": "t.desai@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Municipal Waste Transfer Station",
    "lastActive": "Today, 09:50",
    "active": true
  },
  {
    "id": "STF-INS-32",
    "authUid": "uid_stf-ins-32",
    "name": "Smt. Anandi K. Solanki",
    "role": "inspector",
    "wardIds": [],
    "talukaId": "PMH-GDR",
    "phone": "9426093582",
    "email": "a.solanki@godhranp.gov.in",
    "jurisdiction": "Godhra NP - Commercial Sanitation Squad",
    "lastActive": "Today, 09:00",
    "active": true
  }
];

// 6. COMPLAINTS (18 Complaints with Godhra coordinates)
export const SEED_COMPLAINTS: Complaint[] = [
  (() => {
    const createdAt = hoursAgo(2);
    return {
      id: "CMP-0001",
      ticketId: makeTicketId(createdAt, "0001"),
      deviceId: "DEV-DEMO-0007",
      category: "garbage_dump",
      photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7793,"lng":73.6237},
      wardId: "W03",
      createdAt,
      status: "received",
      assignedTo: undefined,
      assignedToName: undefined,
      escalationLevel: 0,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Garbage pile behind the Bhadrapura bus stand.",
      citizenDeviceId: "DEV-DEMO-0007",
      timeline: {
        receivedAt: createdAt,
        assignedAt: undefined,
        escalatedAt: undefined,
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(3.67);
    return {
      id: "CMP-0002",
      ticketId: makeTicketId(createdAt, "0002"),
      deviceId: "DEV-DEMO-0402",
      category: "open_gutter",
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7744,"lng":73.6185},
      wardId: "W05",
      createdAt,
      status: "assigned",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Open gutter in Navi Pole lane 3.",
      citizenDeviceId: "DEV-DEMO-0402",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(2.83),
        escalatedAt: undefined,
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(1.17);
    return {
      id: "CMP-0003",
      ticketId: makeTicketId(createdAt, "0003"),
      deviceId: "DEV-DEMO-0311",
      category: "missed_collection",
      photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7682,"lng":73.6124},
      wardId: "W07",
      createdAt,
      status: "received",
      assignedTo: undefined,
      assignedToName: undefined,
      escalationLevel: 0,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Van did not reach Lakhana before 09:00.",
      citizenDeviceId: "DEV-DEMO-0311",
      timeline: {
        receivedAt: createdAt,
        assignedAt: undefined,
        escalatedAt: undefined,
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(23.25);
    return {
      id: "CMP-0004",
      ticketId: makeTicketId(createdAt, "0004"),
      deviceId: "DEV-DEMO-0518",
      category: "public_toilet",
      photoUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7716,"lng":73.6428},
      wardId: "W11",
      createdAt,
      status: "assigned",
      assignedTo: "STF-INS-02",
      assignedToName: "Smt. P. K. Rathod",
      escalationLevel: 0,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Public toilet at GIDC gate 5 is not clean.",
      citizenDeviceId: "DEV-DEMO-0518",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(22.17),
        escalatedAt: undefined,
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(25.08);
    return {
      id: "CMP-0005",
      ticketId: makeTicketId(createdAt, "0005"),
      deviceId: "DEV-DEMO-0620",
      category: "construction_debris",
      photoUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7703,"lng":73.6306},
      wardId: "W12",
      createdAt,
      status: "resolved",
      assignedTo: "STF-INS-02",
      assignedToName: "Smt. P. K. Rathod",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(19),
      mergedInto: undefined,
      note: "Debris cleared and dumped at the GIDC yard.",
      citizenDeviceId: "DEV-DEMO-0620",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(24.67),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(19)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(17.83);
    return {
      id: "CMP-0006",
      ticketId: makeTicketId(createdAt, "0006"),
      deviceId: "DEV-DEMO-0712",
      category: "garbage_dump",
      photoUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7816,"lng":73.6305},
      wardId: "W09",
      createdAt,
      status: "escalated",
      assignedTo: "STF-INS-02",
      assignedToName: "Smt. P. K. Rathod",
      escalationLevel: 1,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Pile has grown for two days.",
      citizenDeviceId: "DEV-DEMO-0712",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(17.25),
        escalatedAt: hoursAgo(-6.17),
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(50.5);
    return {
      id: "CMP-0007",
      ticketId: makeTicketId(createdAt, "0007"),
      deviceId: "DEV-DEMO-0822",
      category: "dead_animal",
      photoUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7824,"lng":73.6168},
      wardId: "W02",
      createdAt,
      status: "assigned",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Dead dog near Raipur cross road.",
      citizenDeviceId: "DEV-DEMO-0822",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(50.08),
        escalatedAt: undefined,
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(48);
    return {
      id: "CMP-0008",
      ticketId: makeTicketId(createdAt, "0008"),
      deviceId: "DEV-DEMO-0933",
      category: "hazardous_waste",
      photoUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7883,"lng":73.6304},
      wardId: "W16",
      createdAt,
      status: "escalated",
      assignedTo: "STF-INS-02",
      assignedToName: "Smt. P. K. Rathod",
      escalationLevel: 2,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Chemical drums dumped near Kalol Road.",
      citizenDeviceId: "DEV-DEMO-0933",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(47.33),
        escalatedAt: hoursAgo(0),
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(16.25);
    return {
      id: "CMP-0009",
      ticketId: makeTicketId(createdAt, "0009"),
      deviceId: "DEV-DEMO-0007",
      category: "missed_collection",
      photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7788,"lng":73.6225},
      wardId: "W03",
      createdAt,
      status: "assigned",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Van skipped Bhadrapura Main Road on the second round.",
      citizenDeviceId: "DEV-DEMO-0007",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(15.83),
        escalatedAt: undefined,
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(98.17);
    return {
      id: "CMP-0010",
      ticketId: makeTicketId(createdAt, "0010"),
      deviceId: "DEV-DEMO-1155",
      category: "garbage_dump",
      photoUrl: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7848,"lng":73.6103},
      wardId: "W01",
      createdAt,
      status: "resolved",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(93.17),
      mergedInto: undefined,
      note: "Cleared by the morning van.",
      citizenDeviceId: "DEV-DEMO-1155",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(97.83),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(93.17)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(117.75);
    return {
      id: "CMP-0011",
      ticketId: makeTicketId(createdAt, "0011"),
      deviceId: "DEV-DEMO-1266",
      category: "open_gutter",
      photoUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7777,"lng":73.6362},
      wardId: "W10",
      createdAt,
      status: "resolved",
      assignedTo: "STF-INS-02",
      assignedToName: "Smt. P. K. Rathod",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(96.33),
      mergedInto: undefined,
      note: "Citizen did not respond to the verification request.",
      citizenDeviceId: "DEV-DEMO-1266",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(117.33),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(96.33)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(168.92);
    return {
      id: "CMP-0012",
      ticketId: makeTicketId(createdAt, "0012"),
      deviceId: "DEV-DEMO-0007",
      category: "other",
      photoUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7795,"lng":73.6228},
      wardId: "W03",
      createdAt,
      status: "reopened",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(140.33),
      mergedInto: undefined,
      note: "Sweeping was not done on the lane behind the school.",
      citizenDeviceId: "DEV-DEMO-0007",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(168.33),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(140.33)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(218.58);
    return {
      id: "CMP-0013",
      ticketId: makeTicketId(createdAt, "0013"),
      deviceId: "DEV-DEMO-1488",
      category: "garbage_dump",
      photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7654,"lng":73.6204},
      wardId: "W08",
      createdAt,
      status: "resolved",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(185.83),
      mergedInto: undefined,
      note: "Cleared the next day after the second visit.",
      citizenDeviceId: "DEV-DEMO-1488",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(218.17),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(185.83)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(360.25);
    return {
      id: "CMP-0014",
      ticketId: makeTicketId(createdAt, "0014"),
      deviceId: "DEV-DEMO-1599",
      category: "missed_collection",
      photoUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7763,"lng":73.6114},
      wardId: "W04",
      createdAt,
      status: "resolved",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(352),
      mergedInto: undefined,
      note: "Second round completed.",
      citizenDeviceId: "DEV-DEMO-1599",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(359.83),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(352)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(597.08);
    return {
      id: "CMP-0015",
      ticketId: makeTicketId(createdAt, "0015"),
      deviceId: "DEV-DEMO-1610",
      category: "garbage_dump",
      photoUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7904,"lng":73.6183},
      wardId: "W14",
      createdAt,
      status: "resolved",
      assignedTo: "STF-INS-02",
      assignedToName: "Smt. P. K. Rathod",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(591.25),
      mergedInto: undefined,
      note: "Cleared with the evening van.",
      citizenDeviceId: "DEV-DEMO-1610",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(596.67),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(591.25)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(0.63);
    return {
      id: "CMP-0016",
      ticketId: makeTicketId(createdAt, "0016"),
      deviceId: "DEV-DEMO-1731",
      category: "garbage_dump",
      photoUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7685,"lng":73.6117},
      wardId: "W07",
      createdAt,
      status: "received",
      assignedTo: undefined,
      assignedToName: undefined,
      escalationLevel: 0,
      resolvedPhotoUrl: undefined,
      resolvedAt: undefined,
      mergedInto: undefined,
      note: "Second pile reported on the same lane in Lakhana.",
      citizenDeviceId: "DEV-DEMO-1731",
      timeline: {
        receivedAt: createdAt,
        assignedAt: undefined,
        escalatedAt: undefined,
        resolvedAt: undefined
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(24.83);
    return {
      id: "CMP-0017",
      ticketId: makeTicketId(createdAt, "0017"),
      deviceId: "DEV-DEMO-0007",
      category: "open_gutter",
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7786,"lng":73.6241},
      wardId: "W03",
      createdAt,
      status: "pending_verification",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(2.25),
      mergedInto: undefined,
      note: "Gutter covered and disinfected.",
      citizenDeviceId: "DEV-DEMO-0007",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(24.33),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(2.25)
      }
    };
  })(),
  (() => {
    const createdAt = hoursAgo(143.08);
    return {
      id: "CMP-0018",
      ticketId: makeTicketId(createdAt, "0018"),
      deviceId: "DEV-DEMO-0007",
      category: "garbage_dump",
      photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
      location: {"lat":22.7798,"lng":73.6219},
      wardId: "W03",
      createdAt,
      status: "resolved",
      assignedTo: "STF-INS-01",
      assignedToName: "Shri A. B. Chauhan",
      escalationLevel: 0,
      resolvedPhotoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      resolvedAt: hoursAgo(136.67),
      mergedInto: undefined,
      note: "Cleared and the spot was swept.",
      citizenDeviceId: "DEV-DEMO-0007",
      timeline: {
        receivedAt: createdAt,
        assignedAt: hoursAgo(142.67),
        escalatedAt: undefined,
        resolvedAt: hoursAgo(136.67)
      }
    };
  })()
];

// 7. ATTENDANCE (6 Attendance Records)
export const SEED_ATTENDANCE: AttendanceRecord[] = [
  {
    "id": "ATT-DR-1001",
    "driverId": "DR-1001",
    "driverName": "Rameshbhai B. Solanki",
    "driverCode": "DR-1001",
    "vanPlate": "GJ-17-GV-2401",
    "scheduled": "07:00",
    "started": "07:05",
    "ended": "--",
    "wardsDone": "2 of 4",
    "status": "on_time",
    "lateMinutes": 0,
    "date": "today"
  },
  {
    "id": "ATT-DR-1002",
    "driverId": "DR-1002",
    "driverName": "Kiranbhai J. Patel",
    "driverCode": "DR-1002",
    "vanPlate": "GJ-17-GV-2402",
    "scheduled": "07:30",
    "started": "07:34",
    "ended": "--",
    "wardsDone": "2 of 3",
    "status": "on_time",
    "lateMinutes": 0,
    "date": "today"
  },
  {
    "id": "ATT-DR-1003",
    "driverId": "DR-1003",
    "driverName": "Mehulbhai R. Chauhan",
    "driverCode": "DR-1003",
    "vanPlate": "GJ-17-GV-2403",
    "scheduled": "08:00",
    "started": "08:02",
    "ended": "--",
    "wardsDone": "1 of 3",
    "status": "on_time",
    "lateMinutes": 0,
    "date": "today"
  },
  {
    "id": "ATT-DR-1004",
    "driverId": "DR-1004",
    "driverName": "Sanjaybhai K. Parmar",
    "driverCode": "DR-1004",
    "vanPlate": "GJ-17-GV-2404",
    "scheduled": "08:30",
    "started": "08:33",
    "ended": "--",
    "wardsDone": "0 of 3",
    "status": "on_time",
    "lateMinutes": 0,
    "date": "today"
  },
  {
    "id": "ATT-DR-1005",
    "driverId": "DR-1005",
    "driverName": "Dineshbhai S. Rathod",
    "driverCode": "DR-1005",
    "vanPlate": "GJ-17-GV-2405",
    "scheduled": "09:00",
    "started": "--",
    "ended": "--",
    "wardsDone": "0 of 2",
    "status": "off_duty",
    "lateMinutes": 0,
    "date": "today"
  },
  {
    "id": "ATT-DR-1006",
    "driverId": "DR-1006",
    "driverName": "Alpeshbhai V. Baria",
    "driverCode": "DR-1006",
    "vanPlate": "GJ-17-GV-2406",
    "scheduled": "09:30",
    "started": "09:31",
    "ended": "--",
    "wardsDone": "0 of 1",
    "status": "off_duty",
    "lateMinutes": 0,
    "date": "today"
  }
];

// 8. ALERTS (6 Alerts: 1 critical, 2 warning, 3 info)
export const SEED_ALERTS: AlertItem[] = [
  {
    id: "ALT-0001",
    severity: "critical",
    title: "Van GJ-17-GV-2406 has not sent a location for 42 minutes.",
    detail: "Van GJ-17-GV-2406 has not sent a location for 42 minutes.",
    timeAgo: formatAlertTimeAgo(42),
    timestamp: minutesAgo(42),
    driverPhone: "9426093552",
    vanId: "VAN-06",
    wardId: "W16",
    complaintId: undefined,
    acknowledged: false
  },
  {
    id: "ALT-0002",
    severity: "warning",
    title: "Ward 7 Lakhana has 4 missed-collection reports today. Threshold is 3.",
    detail: "Ward 7 Lakhana has 4 missed-collection reports today. Threshold is 3.",
    timeAgo: formatAlertTimeAgo(25),
    timestamp: minutesAgo(25),
    driverPhone: "9898013227",
    vanId: "VAN-02",
    wardId: "W07",
    complaintId: undefined,
    acknowledged: false
  },
  {
    id: "ALT-0003",
    severity: "warning",
    title: "Complaint PMH-20261101-0008 escalated to the DDO at level 2.",
    detail: "Complaint PMH-20261101-0008 escalated to the DDO at level 2.",
    timeAgo: formatAlertTimeAgo(20),
    timestamp: minutesAgo(20),
    driverPhone: undefined,
    vanId: undefined,
    wardId: "W16",
    complaintId: undefined,
    acknowledged: false
  },
  {
    id: "ALT-0004",
    severity: "info",
    title: "Complaint PMH-20261103-0001 has been unassigned for 2 hours in ward 3.",
    detail: "Complaint PMH-20261103-0001 has been unassigned for 2 hours in ward 3.",
    timeAgo: formatAlertTimeAgo(120),
    timestamp: minutesAgo(120),
    driverPhone: undefined,
    vanId: undefined,
    wardId: "W03",
    complaintId: undefined,
    acknowledged: false
  },
  {
    id: "ALT-0005",
    severity: "info",
    title: "Van GJ-17-GV-2404 battery is at 12 percent.",
    detail: "Van GJ-17-GV-2404 battery is at 12 percent.",
    timeAgo: formatAlertTimeAgo(3),
    timestamp: minutesAgo(3),
    driverPhone: "9904378215",
    vanId: "VAN-04",
    wardId: "W11",
    complaintId: undefined,
    acknowledged: true
  },
  {
    id: "ALT-0006",
    severity: "info",
    title: "Van GJ-17-GV-2401 PUC expires on 2026-11-13.",
    detail: "Van GJ-17-GV-2401 PUC expires on 2026-11-13.",
    timeAgo: formatAlertTimeAgo(260),
    timestamp: minutesAgo(260),
    driverPhone: "9825043241",
    vanId: "VAN-01",
    wardId: undefined,
    complaintId: undefined,
    acknowledged: true
  }
];

// 9. AUDIT LOGS (10 Immutable Audit Trail Records)
export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-0001",
    time: formatAuditTime(40),
    user: {"name":"Smt. P. K. Rathod","role":"inspector","initials":"PK"},
    role: "inspector",
    action: "notice.send",
    target: "W11",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0002",
    time: formatAuditTime(70),
    user: {"name":"Smt. M. J. Desai","role":"chief_officer","initials":"MJ"},
    role: "chief_officer",
    action: "complaint.assign",
    target: "PMH-20261103-0002",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0003",
    time: formatAuditTime(140),
    user: {"name":"Smt. M. J. Desai","role":"chief_officer","initials":"MJ"},
    role: "chief_officer",
    action: "notice.send",
    target: "VAN-01",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0004",
    time: formatAuditTime(170),
    user: {"name":"Shri A. B. Chauhan","role":"inspector","initials":"AB"},
    role: "inspector",
    action: "driver.assign_wards",
    target: "DR-1002",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0005",
    time: formatAuditTime(1060),
    user: {"name":"Smt. M. J. Desai","role":"chief_officer","initials":"MJ"},
    role: "chief_officer",
    action: "route.update",
    target: "RT-GDR-03",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0006",
    time: formatAuditTime(1330),
    user: {"name":"Shri R. K. Patel","role":"ddo","initials":"RK"},
    role: "ddo",
    action: "staff.add",
    target: "STF-INS-02",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0007",
    time: formatAuditTime(1480),
    user: {"name":"Smt. P. K. Rathod","role":"inspector","initials":"PK"},
    role: "inspector",
    action: "complaint.resolve",
    target: "PMH-20261102-0005",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0008",
    time: formatAuditTime(2380),
    user: {"name":"Smt. M. J. Desai","role":"chief_officer","initials":"MJ"},
    role: "chief_officer",
    action: "van.register",
    target: "VAN-06",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0009",
    time: formatAuditTime(2800),
    user: {"name":"Shri A. B. Chauhan","role":"inspector","initials":"AB"},
    role: "inspector",
    action: "ward.polygon_edit",
    target: "W08",
    device: "Chrome, Godhra"
  },
  {
    id: "AUD-0010",
    time: formatAuditTime(3300),
    user: {"name":"Shri R. K. Patel","role":"ddo","initials":"RK"},
    role: "ddo",
    action: "escalation.update",
    target: "district",
    device: "Chrome, Godhra"
  }
];

// 10. SETTINGS
export const SEED_SETTINGS: SettingsConfig = {
  "escalationL1Hours": 24,
  "escalationL2Hours": 48,
  "resolveTargetHours": 72,
  "categories": {
    "garbageDump": {
      "targetHours": 48,
      "notifyInspector": true
    },
    "openGutter": {
      "targetHours": 72,
      "notifyInspector": true
    },
    "missedCollection": {
      "targetHours": 24,
      "notifyInspector": true
    },
    "other": {
      "targetHours": 72,
      "notifyInspector": true
    }
  },
  "alerts": {
    "vanOffline10m": true,
    "lateStart15m": true,
    "vanLeavesArea": true,
    "docExpiring30d": true,
    "threeMissedReports": true
  }
};

// 11. TRIPS (10 Trips: trips[0] is flagged TRIP-20261030-01)
export const SEED_TRIPS: Trip[] = [
  {
    id: "TRIP-20261030-01",
    vanId: "VAN-01",
    routeId: "RT-GDR-01",
    driverId: "DR-1001",
    driverName: "Rameshbhai B. Solanki",
    date: daysAgoStr(4),
    startedAt: "07:05",
    endedAt: "11:20",
    wardsDone: [
      {
            "wardId": "W01",
            "doneAt": "07:50",
            "flagged": false
      },
      {
            "wardId": "W02",
            "doneAt": "08:47",
            "flagged": false
      },
      {
            "wardId": "W03",
            "doneAt": "09:44",
            "flagged": false
      },
      {
            "wardId": "W04",
            "doneAt": "11:18",
            "flagged": true
      }
],
    alertedWardIds: ["W01","W02","W03","W04"],
    gpsTrail: [
      {
            "lat": 22.785,
            "lng": 73.61,
            "t": "07:05",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7835,
            "lng": 73.6135,
            "t": "07:47"
      },
      {
            "lat": 22.782,
            "lng": 73.617,
            "t": "08:30",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7805,
            "lng": 73.62,
            "t": "09:12",
            "isFlagged": true,
            "flagReason": "Ward marked done 220 m outside the boundary"
      },
      {
            "lat": 22.779,
            "lng": 73.623,
            "t": "09:55",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7775,
            "lng": 73.617,
            "t": "10:37"
      },
      {
            "lat": 22.776,
            "lng": 73.611,
            "t": "11:20",
            "isStop": true,
            "stopDurationMin": 14
      }
],
    mockLocationDetected: false,
    distanceKm: 13.6,
    duration: "4 h 15 min",
    stopsCount: 4,
    flaggedCount: 1,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261102-01",
    vanId: "VAN-01",
    routeId: "RT-GDR-01",
    driverId: "DR-1001",
    driverName: "Rameshbhai B. Solanki",
    date: daysAgoStr(1),
    startedAt: "07:03",
    endedAt: "11:12",
    wardsDone: [
      {
            "wardId": "W01",
            "doneAt": "07:48",
            "flagged": false
      },
      {
            "wardId": "W02",
            "doneAt": "08:36",
            "flagged": false
      },
      {
            "wardId": "W03",
            "doneAt": "09:41",
            "flagged": false
      },
      {
            "wardId": "W04",
            "doneAt": "10:52",
            "flagged": false
      }
],
    alertedWardIds: ["W01","W02","W03","W04"],
    gpsTrail: [
      {
            "lat": 22.785,
            "lng": 73.61,
            "t": "07:03",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7835,
            "lng": 73.6135,
            "t": "07:44"
      },
      {
            "lat": 22.782,
            "lng": 73.617,
            "t": "08:26",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7805,
            "lng": 73.62,
            "t": "09:07"
      },
      {
            "lat": 22.779,
            "lng": 73.623,
            "t": "09:49",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7775,
            "lng": 73.617,
            "t": "10:30"
      },
      {
            "lat": 22.776,
            "lng": 73.611,
            "t": "11:12",
            "isStop": true,
            "stopDurationMin": 14
      }
],
    mockLocationDetected: false,
    distanceKm: 14.8,
    duration: "4 h 09 min",
    stopsCount: 4,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261101-01",
    vanId: "VAN-01",
    routeId: "RT-GDR-01",
    driverId: "DR-1001",
    driverName: "Rameshbhai B. Solanki",
    date: daysAgoStr(2),
    startedAt: "07:10",
    endedAt: "11:05",
    wardsDone: [
      {
            "wardId": "W01",
            "doneAt": "07:55",
            "flagged": false
      },
      {
            "wardId": "W02",
            "doneAt": "08:44",
            "flagged": false
      },
      {
            "wardId": "W03",
            "doneAt": "09:38",
            "flagged": false
      },
      {
            "wardId": "W04",
            "doneAt": "10:47",
            "flagged": false
      }
],
    alertedWardIds: ["W01","W02","W03","W04"],
    gpsTrail: [
      {
            "lat": 22.785,
            "lng": 73.61,
            "t": "07:10",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7835,
            "lng": 73.6135,
            "t": "07:49"
      },
      {
            "lat": 22.782,
            "lng": 73.617,
            "t": "08:28",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7805,
            "lng": 73.62,
            "t": "09:07"
      },
      {
            "lat": 22.779,
            "lng": 73.623,
            "t": "09:46",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7775,
            "lng": 73.617,
            "t": "10:25"
      },
      {
            "lat": 22.776,
            "lng": 73.611,
            "t": "11:05",
            "isStop": true,
            "stopDurationMin": 14
      }
],
    mockLocationDetected: false,
    distanceKm: 15.3,
    duration: "3 h 55 min",
    stopsCount: 4,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261031-01",
    vanId: "VAN-01",
    routeId: "RT-GDR-01",
    driverId: "DR-1001",
    driverName: "Rameshbhai B. Solanki",
    date: daysAgoStr(3),
    startedAt: "07:02",
    endedAt: "10:58",
    wardsDone: [
      {
            "wardId": "W01",
            "doneAt": "07:44",
            "flagged": false
      },
      {
            "wardId": "W02",
            "doneAt": "08:39",
            "flagged": false
      },
      {
            "wardId": "W03",
            "doneAt": "09:35",
            "flagged": false
      },
      {
            "wardId": "W04",
            "doneAt": "10:41",
            "flagged": false
      }
],
    alertedWardIds: ["W01","W02","W03","W04"],
    gpsTrail: [
      {
            "lat": 22.785,
            "lng": 73.61,
            "t": "07:02",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7835,
            "lng": 73.6135,
            "t": "07:41"
      },
      {
            "lat": 22.782,
            "lng": 73.617,
            "t": "08:20",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7805,
            "lng": 73.62,
            "t": "09:00"
      },
      {
            "lat": 22.779,
            "lng": 73.623,
            "t": "09:39",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7775,
            "lng": 73.617,
            "t": "10:18"
      },
      {
            "lat": 22.776,
            "lng": 73.611,
            "t": "10:58",
            "isStop": true,
            "stopDurationMin": 14
      }
],
    mockLocationDetected: false,
    distanceKm: 14.1,
    duration: "3 h 56 min",
    stopsCount: 4,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261029-01",
    vanId: "VAN-01",
    routeId: "RT-GDR-01",
    driverId: "DR-1001",
    driverName: "Rameshbhai B. Solanki",
    date: daysAgoStr(5),
    startedAt: "07:00",
    endedAt: "11:02",
    wardsDone: [
      {
            "wardId": "W01",
            "doneAt": "07:42",
            "flagged": false
      },
      {
            "wardId": "W02",
            "doneAt": "08:35",
            "flagged": false
      },
      {
            "wardId": "W03",
            "doneAt": "09:31",
            "flagged": false
      },
      {
            "wardId": "W04",
            "doneAt": "10:50",
            "flagged": false
      }
],
    alertedWardIds: ["W01","W02","W03","W04"],
    gpsTrail: [
      {
            "lat": 22.785,
            "lng": 73.61,
            "t": "07:00",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7835,
            "lng": 73.6135,
            "t": "07:40"
      },
      {
            "lat": 22.782,
            "lng": 73.617,
            "t": "08:20",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7805,
            "lng": 73.62,
            "t": "09:01"
      },
      {
            "lat": 22.779,
            "lng": 73.623,
            "t": "09:41",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7775,
            "lng": 73.617,
            "t": "10:21"
      },
      {
            "lat": 22.776,
            "lng": 73.611,
            "t": "11:02",
            "isStop": true,
            "stopDurationMin": 14
      }
],
    mockLocationDetected: false,
    distanceKm: 14.4,
    duration: "4 h 02 min",
    stopsCount: 4,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261103-01",
    vanId: "VAN-01",
    routeId: "RT-GDR-01",
    driverId: "DR-1001",
    driverName: "Rameshbhai B. Solanki",
    date: daysAgoStr(0),
    startedAt: "07:05",
    endedAt: undefined,
    wardsDone: [
      {
            "wardId": "W01",
            "doneAt": "07:52",
            "flagged": false
      },
      {
            "wardId": "W02",
            "doneAt": "08:41",
            "flagged": false
      }
],
    alertedWardIds: ["W01","W02"],
    gpsTrail: [
      {
            "lat": 22.785,
            "lng": 73.61,
            "t": "07:05",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7835,
            "lng": 73.6135,
            "t": "07:37"
      },
      {
            "lat": 22.782,
            "lng": 73.617,
            "t": "08:10",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7805,
            "lng": 73.62,
            "t": "08:42"
      },
      {
            "lat": 22.779,
            "lng": 73.623,
            "t": "09:15"
      },
      {
            "lat": 22.7775,
            "lng": 73.617,
            "t": "09:47"
      },
      {
            "lat": 22.776,
            "lng": 73.611,
            "t": "10:20"
      }
],
    mockLocationDetected: false,
    distanceKm: 6.4,
    duration: undefined,
    stopsCount: 2,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261103-02",
    vanId: "VAN-02",
    routeId: "RT-GDR-02",
    driverId: "DR-1002",
    driverName: "Kiranbhai J. Patel",
    date: daysAgoStr(0),
    startedAt: "07:34",
    endedAt: undefined,
    wardsDone: [
      {
            "wardId": "W05",
            "doneAt": "08:12",
            "flagged": false
      },
      {
            "wardId": "W06",
            "doneAt": "08:58",
            "flagged": false
      }
],
    alertedWardIds: ["W05","W06"],
    gpsTrail: [
      {
            "lat": 22.774,
            "lng": 73.618,
            "t": "07:34",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7725,
            "lng": 73.6215,
            "t": "08:15"
      },
      {
            "lat": 22.771,
            "lng": 73.625,
            "t": "08:57",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7695,
            "lng": 73.6185,
            "t": "09:38"
      },
      {
            "lat": 22.768,
            "lng": 73.612,
            "t": "10:20"
      }
],
    mockLocationDetected: false,
    distanceKm: 5.1,
    duration: undefined,
    stopsCount: 2,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261103-03",
    vanId: "VAN-03",
    routeId: "RT-GDR-03",
    driverId: "DR-1003",
    driverName: "Mehulbhai R. Chauhan",
    date: daysAgoStr(0),
    startedAt: "08:02",
    endedAt: undefined,
    wardsDone: [
      {
            "wardId": "W08",
            "doneAt": "08:40",
            "flagged": false
      }
],
    alertedWardIds: ["W08"],
    gpsTrail: [
      {
            "lat": 22.765,
            "lng": 73.62,
            "t": "08:02",
            "isStop": true,
            "stopDurationMin": 14
      },
      {
            "lat": 22.7735,
            "lng": 73.625,
            "t": "08:36"
      },
      {
            "lat": 22.782,
            "lng": 73.63,
            "t": "09:11"
      },
      {
            "lat": 22.78,
            "lng": 73.633,
            "t": "09:45"
      },
      {
            "lat": 22.778,
            "lng": 73.636,
            "t": "10:20"
      }
],
    mockLocationDetected: false,
    distanceKm: 3.8,
    duration: undefined,
    stopsCount: 1,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261103-04",
    vanId: "VAN-04",
    routeId: "RT-GDR-04",
    driverId: "DR-1004",
    driverName: "Sanjaybhai K. Parmar",
    date: daysAgoStr(0),
    startedAt: "08:33",
    endedAt: undefined,
    wardsDone: [],
    alertedWardIds: [],
    gpsTrail: [
      {
            "lat": 22.772,
            "lng": 73.642,
            "t": "08:33"
      },
      {
            "lat": 22.771,
            "lng": 73.636,
            "t": "08:59"
      },
      {
            "lat": 22.77,
            "lng": 73.63,
            "t": "09:26"
      },
      {
            "lat": 22.765,
            "lng": 73.629,
            "t": "09:53"
      },
      {
            "lat": 22.76,
            "lng": 73.628,
            "t": "10:20"
      }
],
    mockLocationDetected: false,
    distanceKm: 1.2,
    duration: undefined,
    stopsCount: 0,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  },
  {
    id: "TRIP-20261103-06",
    vanId: "VAN-06",
    routeId: "RT-GDR-06",
    driverId: "DR-1006",
    driverName: "Alpeshbhai V. Baria",
    date: daysAgoStr(0),
    startedAt: "09:31",
    endedAt: undefined,
    wardsDone: [],
    alertedWardIds: [],
    gpsTrail: [
      {
            "lat": 22.784,
            "lng": 73.626,
            "t": "09:31"
      },
      {
            "lat": 22.785,
            "lng": 73.6275,
            "t": "09:39"
      },
      {
            "lat": 22.786,
            "lng": 73.629,
            "t": "09:47"
      },
      {
            "lat": 22.787,
            "lng": 73.6295,
            "t": "09:55"
      },
      {
            "lat": 22.788,
            "lng": 73.63,
            "t": "10:03"
      },
      {
            "lat": 22.789,
            "lng": 73.631,
            "t": "10:11"
      },
      {
            "lat": 22.79,
            "lng": 73.632,
            "t": "10:20"
      }
],
    mockLocationDetected: false,
    distanceKm: 0.9,
    duration: undefined,
    stopsCount: 0,
    flaggedCount: 0,
    flaggedReason: "Ward marked done 220 m outside the boundary"
  }
];

// 12. NOTICES (6 Broadcast Notices)
export const SEED_NOTICES: Notice[] = [
  {
    id: "NTC-0001",
    title: "Shift timing",
    targetType: "all",
    targetId: undefined,
    wardIds: ["W01","W02","W03","W04","W05","W06","W07","W08","W09","W10","W11","W12","W13","W14","W15","W16"],
    message: "Collection starts at 07:00 today. Please reach your first ward on time.",
    createdAt: "Today, 06:30",
    createdBy: "Smt. M. J. Desai",
    when: "Send now",
    language: "Gujarati and English",
    photoUrl: undefined,
    deliveredCount: 6,
    totalTarget: 6
  },
  {
    id: "NTC-0002",
    title: "Festival day timing",
    targetType: "ward",
    targetId: "W05",
    wardIds: ["W05"],
    message: "Festival at Rampura today. Complete ward 5 before 09:00.",
    createdAt: "Today, 07:10",
    createdBy: "Smt. M. J. Desai",
    when: "Send now",
    language: "Gujarati and English",
    photoUrl: undefined,
    deliveredCount: 1,
    totalTarget: 1
  },
  {
    id: "NTC-0003",
    title: "PUC renewal",
    targetType: "van",
    targetId: "VAN-01",
    wardIds: ["W01","W02","W03","W04"],
    message: "PUC expires on 13 Nov. Get it renewed this week.",
    createdAt: "Today, 08:00",
    createdBy: "Smt. M. J. Desai",
    when: "Send now",
    language: "English",
    photoUrl: undefined,
    deliveredCount: 1,
    totalTarget: 1
  },
  {
    id: "NTC-0004",
    title: "Weather advisory",
    targetType: "all",
    targetId: undefined,
    wardIds: ["W01","W02","W03","W04","W05","W06","W07","W08","W09","W10","W11","W12","W13","W14","W15","W16"],
    message: "Heavy rain expected after 17:00. Finish routes early and report any blocked lane.",
    createdAt: "Today, 09:15",
    createdBy: "Smt. M. J. Desai",
    when: "Send now",
    language: "Gujarati and English",
    photoUrl: undefined,
    deliveredCount: 6,
    totalTarget: 6
  },
  {
    id: "NTC-0005",
    title: "Gate closure",
    targetType: "ward",
    targetId: "W11",
    wardIds: ["W11"],
    message: "GIDC gate 3 is closed for repair. Use gate 5.",
    createdAt: "Today, 09:40",
    createdBy: "Smt. P. K. Rathod",
    when: "Send now",
    language: "Gujarati and English",
    photoUrl: undefined,
    deliveredCount: 1,
    totalTarget: 1
  },
  {
    id: "NTC-0006",
    title: "Holiday roster",
    targetType: "all",
    targetId: undefined,
    wardIds: ["W01","W02","W03","W04","W05","W06","W07","W08","W09","W10","W11","W12","W13","W14","W15","W16"],
    message: "Diwali holiday roster is on the notice board. Check your duty date.",
    createdAt: "2 days ago",
    createdBy: "Smt. M. J. Desai",
    when: "Send now",
    language: "Gujarati and English",
    photoUrl: undefined,
    deliveredCount: 6,
    totalTarget: 6
  }
];

// 13. RATINGS (18 Public Satisfaction Ratings)
export const SEED_RATINGS: Rating[] = [
  {
    id: "RAT-0001",
    wardId: "W01",
    date: daysAgoStr(0),
    stars: 5,
    deviceId: "DEV-DEMO-2000"
  },
  {
    id: "RAT-0002",
    wardId: "W02",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2001"
  },
  {
    id: "RAT-0003",
    wardId: "W03",
    date: daysAgoStr(0),
    stars: 5,
    deviceId: "DEV-DEMO-2002"
  },
  {
    id: "RAT-0004",
    wardId: "W04",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2003"
  },
  {
    id: "RAT-0005",
    wardId: "W05",
    date: daysAgoStr(0),
    stars: 3,
    deviceId: "DEV-DEMO-2004"
  },
  {
    id: "RAT-0006",
    wardId: "W06",
    date: daysAgoStr(0),
    stars: 5,
    deviceId: "DEV-DEMO-2005"
  },
  {
    id: "RAT-0007",
    wardId: "W07",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2006"
  },
  {
    id: "RAT-0008",
    wardId: "W08",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2007"
  },
  {
    id: "RAT-0009",
    wardId: "W09",
    date: daysAgoStr(0),
    stars: 5,
    deviceId: "DEV-DEMO-2008"
  },
  {
    id: "RAT-0010",
    wardId: "W10",
    date: daysAgoStr(0),
    stars: 2,
    deviceId: "DEV-DEMO-2009"
  },
  {
    id: "RAT-0011",
    wardId: "W11",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2010"
  },
  {
    id: "RAT-0012",
    wardId: "W12",
    date: daysAgoStr(0),
    stars: 5,
    deviceId: "DEV-DEMO-2011"
  },
  {
    id: "RAT-0013",
    wardId: "W13",
    date: daysAgoStr(0),
    stars: 3,
    deviceId: "DEV-DEMO-2012"
  },
  {
    id: "RAT-0014",
    wardId: "W14",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2013"
  },
  {
    id: "RAT-0015",
    wardId: "W15",
    date: daysAgoStr(0),
    stars: 5,
    deviceId: "DEV-DEMO-2014"
  },
  {
    id: "RAT-0016",
    wardId: "W16",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2015"
  },
  {
    id: "RAT-0017",
    wardId: "W01",
    date: daysAgoStr(0),
    stars: 4,
    deviceId: "DEV-DEMO-2016"
  },
  {
    id: "RAT-0018",
    wardId: "W06",
    date: daysAgoStr(0),
    stars: 5,
    deviceId: "DEV-DEMO-2017"
  }
];

// 14. REPORTS (4 Predefined Reports)
export const SEED_REPORTS = [
  {
    "id": "REP-0001",
    "name": "Daily collection",
    "range": "03 Nov 2026",
    "format": "PDF",
    "createdBy": "Smt. M. J. Desai"
  },
  {
    "id": "REP-0002",
    "name": "Complaint resolution",
    "range": "28 Oct to 03 Nov",
    "format": "CSV",
    "createdBy": "Shri A. B. Chauhan"
  },
  {
    "id": "REP-0003",
    "name": "Driver performance",
    "range": "Week 44",
    "format": "PDF",
    "createdBy": "Smt. P. K. Rathod"
  },
  {
    "id": "REP-0004",
    "name": "Contractor scorecard",
    "range": "Oct 2026",
    "format": "PDF",
    "createdBy": "Shri R. K. Patel"
  }
];
