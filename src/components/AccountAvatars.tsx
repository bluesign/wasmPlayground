import React from "react";
import { useThemeUI, Flex, Box, Badge } from "theme-ui";
import { motion } from "framer-motion";
import { Account, Project } from "src/_newTypes/newTypes";
import Avatar from "components/Avatar";
export const AccountAvatar: React.FC<{
  onClick: (e: any, i: number) => void;
  active: boolean;
}> = ({ children, onClick }) => {
  return (
    <motion.div>
      <Box
        //@ts-ignore
        onClick={onClick}
        mx={"0.5rem"}
        sx={{
          position: "relative",
          borderRadius: "50%",
          ".avatar": {
            position: "relative",
            top: "-3px"
          }
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
};

export const AvatarList: React.FC = ({ children }) => {
  return (
    <Flex
      sx={{
        flex: "1 1 auto",
        alignItems: "center"
      }}
    >
      {children}
    </Flex>
  );
};

const noop = (): void => {};

const AccountAvatars: React.FC<{
  multi?: boolean;
  selectedAccounts: number[];
  onChange: (selected: number) => void;
  project: Project;
  accounts: Account[];
  maxSelection?: number;
}> = (props) => {
  const { multi, selectedAccounts, accounts, onChange, maxSelection = 4 } = props;
  if (!multi) {
    throw new Error("Must include multi prop.");
  }

  const { theme } = useThemeUI();

  const selectionLimitReached = selectedAccounts.length >= maxSelection;
  return (
    <AvatarList>
      {accounts.map((account: Account, i: number) => {
        const isSelected =
          selectedAccounts.includes(i) || selectionLimitReached
        return (
          <motion.div key={account.address}>
            <AccountAvatar
              key={account.address}
              onClick={ isSelected
                ? noop
                : () => { onChange(i); }
              }
              active={isSelected}
            >
              <motion.div
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  pointerEvents: isSelected
                    ? "none"
                    : "auto"
                }}
                whileHover={{ scale: 1.05 }}
              >
                <Avatar
                  address={account.address}
                  style={{
                    width: "35px",
                    height: "35px",
                    display: "block",
                    borderRadius: "0 0 20px 20px",
                    filter: isSelected
                    ? "grayscale(1)"
                    : "none"
                  }} />
                <Badge
                  px={"5px"}
                  sx={{
                    fontSize: 3,
                    backgroundColor: isSelected? theme.colors.greyBorder : theme.colors.primary,
                    position: "absolute",
                    left: "-2px",
                    bottom: "-1px"
                  }}
                >
                  0x{account.id.slice(2,4)}
                </Badge>
              </motion.div>
            </AccountAvatar>
          </motion.div>
        );
      })}
    </AvatarList>
  );
};

export default AccountAvatars;

// @ts-ignore-end
