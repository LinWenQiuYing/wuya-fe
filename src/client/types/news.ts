export interface NewsProps {
  concept: string[];
  content: string;
  entity_list: StockParams[];
  graph_analysis: string;
  image_url: string;
  industry: string[];
  sort_industry: string[];
  item_id: string;
  news_id: string;
  publish_time: string;
  relation_list: Record<string, string>[];
  source: string;
  source_url: string;
  summary: string;
  text_sentiment: number;
  title: string;
  hot_past24?: number;
  hot_past72?: number;
  isHot: boolean;
  highlight?: any;
}

export interface StockParams {
  sentiment: string;
  stock_code: string;
  text: string;
  type: string;
}

export interface PageParams {
  offset: number;
  size?: number;
  date?: string;
  start_date?: string;
  end_date?: string;
  news_labels?: string[];
  content?: string;
  orderby?: "desc" | "asc";
  interest: 1 | 0;
}

export interface LabelProps {
  has_effect_child: number;
  image_url: string;
  key_word: string;
  label_code: number;
  label_level: number;
  label_name: string;
  label_source: string;
  status: number;
  children: LabelProps[];
}

export interface RealtimeNews {
  offset: number;
  news_list: NewsProps[];
}

export interface TagItem {
  label: string;
  value: number;
  disabled?: boolean;
  keywords?: string;
  source: string;
  children?: TagItem[];
  has_effect_child?: boolean;
  isSelected?: boolean;
  image_url?: string;
  isImageShow: boolean;
}

export interface TagValueItemType {
  label_name: string;
  key_word: string;
}

export interface RecommendTagType {
  code: number;
  label: string;
  source?: string;
  keyword?: string;
}

export interface NewsListItemType {
  news_id: string;
  time: string;
  title: string;
  content: string;
}
