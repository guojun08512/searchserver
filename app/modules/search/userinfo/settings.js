export default {
  settings:
  {
    analysis:
    {
      analyzer:
      {
        first_pinyin_letter_analyzer:
        {
          tokenizer: 'first_pinyin_letter',
          filter: 'NGram_filter',
        },
        full_pinyin_letter:
        {
          tokenizer: 'full_pinyin_letter',
          filter: [
            'lowercase',
          ],
        },
        ik_analyzer:
        {
          type: 'custom',
          tokenizer: 'ik_max_word',
          filter: [
            'word_delimiter',
            'cnchar_type_filter',
          ],
        },
        ik_pinyin_analyzer:
        {
          type: 'custom',
          tokenizer: 'ik_max_word',
          filter: [
            'pinyin_filter',
            'shingle',
            'word_delimiter',
            'unique',
          ],
        },
        ik_pinyin_first_letter_analyzer:
        {
          type: 'custom',
          tokenizer: 'ik_max_word',
          filter: [
            'pinyin_first_letter_filter',
            'cnchar_type_filter',
            'lowercase',
          ],
        },
        id_map_analyzer:
        {
          type: 'custom',
          tokenizer: 'id_tokenizer',
          filter: 'lowercase',
        },
        id_search_analyzer:
        {
          type: 'custom',
          tokenizer: 'whitespace',
          filter: 'lowercase',
        },
        name_acronym_analyzer:
        {
          type: 'custom',
          tokenizer: 'whitespace',
          filter: 'name_acronym_filter',
        },
      },
      tokenizer:
      {
        first_pinyin_letter:
        {
          type: 'pinyin',
          keep_first_letter: true,
          keep_separate_first_letter: false,
          keep_full_pinyin: false,
          keep_original: false,
          limit_first_letter_length: 16,
          lowercase: true,
          trim_whitespace: true,
          keep_none_chinese_in_first_letter: false,
          none_chinese_pinyin_tokenize: false,
          keep_none_chinese: false,
          keep_none_chinese_in_joined_full_pinyin: false,
          remove_duplicated_term: true,
        },
        full_pinyin_letter:
        {
          type: 'pinyin',
          keep_separate_first_letter: true,
          keep_full_pinyin: true,
          keep_original: true,
          limit_first_letter_length: 16,
          lowercase: true,
          // keep_first_letter: false,
          keep_none_chinese_in_first_letter: true,
          keep_none_chinese_together: false,
          none_chinese_pinyin_tokenize: true,
          keep_none_chinese: true,
          trim_whitespace: true,
          keep_none_chinese_in_joined_full_pinyin: true,
          // remove_duplicated_term: true,
        },
        id_tokenizer:
        {
          type: 'ngram',
          min_gram: 2,
          max_ngram_diff: 24,
          token_chars: [],
        },
      },
      char_filter: {
        underline_filter: {
          type: 'pattern_replace',
          pattern: '\\W|_',
          replacement: '',
        },
      },
      filter: {
        word_delimiter:
        {
          type: 'word_delimiter',
          catenate_words: true,
        },
        NGram_filter:
        {
          type: 'ngram',
          min_gram: 1,
          max_ngram_diff: 10,
          token_chars: [
            'letter',
            'digit',
          ],
        },
        pinyin_filter:
        {
          type: 'pinyin',
          lowercase: true,
          trim_whitespace: true,
          keep_none_chinese: false,
          keep_none_chinese_in_first_letter: false,
          keep_first_letter: false,
          keep_full_pinyin: true,
          keep_joined_full_pinyin: true,
          first_letter: 'prefix',
          padding_char: ' ',
        },
        pinyin_first_letter_filter:
        {
          type: 'pinyin',
          lowercase: true,
          trim_whitespace: true,
          keep_none_chinese: false,
          keep_none_chinese_in_first_letter: false,
          keep_none_chinese_together: false,
          none_chinese_pinyin_tokenize: false,
          keep_separate_first_letter: true,
          keep_first_letter: false,
          keep_full_pinyin: false,
          remove_duplicated_term: true,
          first_letter: 'prefix',
          padding_char: ' ',
        },
        shingle:
        {
          type: 'shingle',
          max_shingle_size: 2,
          token_separator: '',
        },
        cnchar_type_filter: {
          type: 'keep_types',
          types: ['CN_CHAR'],
        },
        name_acronym_filter: {
          type: 'ngram',
          min_gram: 1,
          max_ngram_diff: 1,
          token_chars: [
            'letter',
            'digit',
          ],
        },
      },
    },
  },
};
