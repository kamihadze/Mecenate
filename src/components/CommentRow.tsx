import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Comment } from '../api/types';
import { colors, spacing, typography } from '../theme/tokens';
import { Avatar } from './Avatar';

interface Props {
  comment: Comment;
}

export const CommentRow: React.FC<Props> = React.memo(({ comment }) => (
  <View style={styles.row}>
    <Avatar uri={comment.author.avatarUrl} size={40} />
    <View style={styles.body}>
      <Text style={styles.author} numberOfLines={1}>
        {comment.author.displayName}
      </Text>
      <Text style={styles.text}>{comment.text}</Text>
    </View>
  </View>
));

CommentRow.displayName = 'CommentRow';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    gap: 12,
  },
  body: {
    flex: 1,
    paddingTop: 1,
  },
  author: {
    ...typography.authorName,
    color: colors.textPrimary,
  },
  text: {
    ...typography.commentText,
    color: colors.textPrimary,
  },
});
