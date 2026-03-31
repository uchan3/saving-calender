export interface RakutenSearchResult {
  itemName: string;
  itemPrice: number;
  mediumImageUrl: string | null;
  mediumImageUrls: string[];
  itemUrl: string;
  shopName: string;
  itemCode: string;
  itemCaption: string;
  catchcopy: string;
  reviewCount: number;
  reviewAverage: number;
}

export interface RakutenSearchResponse {
  items: RakutenSearchResult[];
  pageCount: number;
  page: number;
  hits: number;
}
