export type RootStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
