export default {
  properties:
  {
    username:
    {
      type: 'keyword',
      fields:
      {
        keyword_ik_pinyin_first_letter:
        {
          type: 'text',
          store: false,
          analyzer: 'ik_pinyin_first_letter_analyzer',
          term_vector: 'with_positions_offsets',
        },
        keyword_ik_pinyin:
        {
          type: 'text',
          store: false,
          analyzer: 'full_pinyin_letter',
          term_vector: 'with_positions_offsets',
        },
        keyword_ik:
        {
          type: 'text',
          store: false,
          analyzer: 'ik_analyzer',
          term_vector: 'with_positions_offsets',
        },
        keyword_map:
        {
          type: 'text',
          store: false,
          analyzer: 'id_map_analyzer',
          term_vector: 'with_positions_offsets',
        },
        keyword:
        {
          type: 'text',
          store: false,
          analyzer: 'standard',
          term_vector: 'with_positions_offsets',
        },
      },
    },
    cellphone:
    {
      type: 'keyword',
      fields:
      {
        keyword:
        {
          type: 'text',
          store: false,
          analyzer: 'id_map_analyzer',
        },
      },
    },
    idcard:
    {
      type: 'keyword',
      fields:
      {
        keyword:
        {
          type: 'text',
          store: false,
          analyzer: 'id_map_analyzer',
        },
      },
    },
    createdat:
    {
      type: 'date',
      format: 'date_time',
    },
  },
};
