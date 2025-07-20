import React, { useEffect, useState } from "react";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";
import { Laugh } from "lucide-react";
import clsx from "clsx";

export function EmojiPickerPopover({
  onSelectEmoji,
  className,
}: {
  onSelectEmoji: (emojiData: EmojiClickData) => void;
  className?: string;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState<
    EmojiClickData | undefined
  >(undefined);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData);
    if (onSelectEmoji) {
      onSelectEmoji(emojiData);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Laugh className={clsx(className)} />
      </PopoverTrigger>
      <PopoverAnchor />
      <PopoverContent
        side="top"
        sideOffset={36}
        align="start"
        alignOffset={-40}
        className="m-0 py-0 px-0 bg-transparent border-0"
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={true}
          lazyLoadEmojis
          emojiStyle={EmojiStyle.NATIVE}
          theme={Theme.AUTO}
        />
      </PopoverContent>
    </Popover>
  );
}

export function ReactionSelector({
  onSelectEmoji,
  className,
}: {
  onSelectEmoji: (emojiData: EmojiClickData) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [emojis, setEmojis] = useState(["1f600", "1f601", "1f602"]);
  const [selectedEmoji, setSelectedEmoji] = useState<
    EmojiClickData | undefined
  >(undefined);

  const handleReactionClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData);
    if (onSelectEmoji) {
      onSelectEmoji(emojiData);
    }
    setOpen(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData);
    if (onSelectEmoji) {
      onSelectEmoji(emojiData);
    }
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="hidden group-hover:flex">
        <Laugh className={clsx(className)} />
      </PopoverTrigger>
      <PopoverAnchor />
      <PopoverContent
        side="top"
        sideOffset={36}
        align="start"
        alignOffset={-40}
        className="m-0 py-0 px-0 bg-transparent border-0"
      >
        <EmojiPicker
          onReactionClick={handleReactionClick}
          onEmojiClick={handleEmojiClick}
          open={open}
          lazyLoadEmojis
          emojiStyle={EmojiStyle.NATIVE}
          theme={Theme.AUTO}
          reactionsDefaultOpen={true}
          reactions={emojis}
        />
      </PopoverContent>
    </Popover>
  );
}
