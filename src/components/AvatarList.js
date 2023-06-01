import {Pressable, View} from 'react-native';
import React from 'react';
import Avatar from './Avatar';

const MAX_AVATARS = 4;

export default function AvatarList({style, members, maxLength, onPress}) {
  const max = maxLength || MAX_AVATARS;
  return (
    <Pressable onPress={onPress} style={[{flexDirection: 'row'}, style]}>
      {members &&
        members.map((member, index) => {
          if (index > max) {
            return;
          }
          if (index === max) {
            return (
              <Avatar
                disabled
                size={24}
                string={`+${members.length - max}`}
                style={{marginLeft: -8}}
              />
            );
          }

          return (
            <Avatar
              disabled
              key={member.id}
              data={member}
              size={24}
              style={{marginLeft: -8}}
            />
          );
        })}
    </Pressable>
  );
}
