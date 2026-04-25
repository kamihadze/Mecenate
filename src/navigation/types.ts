export type RootStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string; focusComposer?: boolean };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
