export type MovieType = {
  titleID: number;
  primaryTitle: string;
  cumulativeRevenue: number;
  avgRating: number;
};

export type DirectorType = {
  primaryName: string;
  minPerMovieRevenueInMillions: number;
  avgPerMovieRevenueInMillions: number;
  maxPerMovieRevenueInMillions: number;
  totalMovies: number;
};

export type TrendsType = {
  totalRevenueThatDayInMillions: number;
  year: number;
  month: number;
  day: number;
};
