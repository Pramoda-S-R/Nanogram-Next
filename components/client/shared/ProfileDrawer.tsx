"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/Drawer";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgeCheck,
  Ellipsis,
  Monitor,
  Shield,
  ShieldAlert,
  Smartphone,
  User,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/AlertDialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignOutButton,
  useClerk,
  useReverification,
  useUser,
} from "@clerk/nextjs";
import {
  CreateExternalAccountParams,
  EmailAddressResource,
  ExternalAccountResource,
  SessionResource,
  SessionWithActivitiesResource,
  UpdateUserPasswordParams,
  UserResource,
} from "@clerk/types";
import { formatRelativeTime, getCurrentSessionIdFromCookie } from "@/utils";
import FileUploader from "./ui/FileUploader";
import OtpInput from "./OtpInput";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { VerificationComponent } from "@/components/client/shared/Reverification";

const ProfileDrawer = () => {
  // const router = useRouter();
  const { isLoaded, user } = useUser();
  const [sessions, setSessions] = useState<SessionWithActivitiesResource[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const revokeSessionById = useReverification((sessionId: string) => {
    return sessions.find((s) => s.id === sessionId)?.revoke();
  });

  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTab, setCurrentTab] = useState(1);
  const pathname = usePathname();

  if (!isLoaded) {
    return <span className="loading loading-ring loading-xl"></span>;
  }

  if (!user) {
    return null; // or handle the case where the user is not authenticated
  }

  // console.log("User:", user.externalAccounts[0].provider);

  async function getSession() {
    if (!user) {
      return;
    }
    const sessions = await user.getSessions();
    console.log("sessions: ", sessions);
    setSessions(sessions);
  }

  async function handleSessionDelete(sessionId: string) {
    setLoading(true);
    try {
      const response = await revokeSessionById(sessionId);
      if (!response) {
        console.error("Failed to revoke session");
        return;
      }
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionId)
      );
    } catch (error) {
      console.error("Error revoking session:", error);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <div
          className="flex h-full items-center tooltip tooltip-bottom"
          data-tip={`${user?.firstName || "User"} ${
            user?.lastName || "Profile"
          }`}
        >
          <div className="relative group w-7 h-7 overflow-hidden rounded-full">
            <img
              src={user?.imageUrl}
              alt={user?.username || "pfp"}
              className="w-full h-full object-cover rounded-full cursor-pointer"
            />
            <div className="pointer-events-none absolute inset-0 before:absolute before:w-[150%] before:h-[150%] before:rotate-45 before:top-[-100%] before:left-[-100%] before:bg-gradient-to-r before:from-transparent before:via-base-100/50 before:to-transparent before:content-[''] before:transition-transform before:duration-500 group-hover:before:translate-x-[200%] group-hover:before:translate-y-[200%]" />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <img
              src={user?.imageUrl}
              alt={user?.username || "pfp"}
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
            />
            <div>
              <p>
                {user.firstName} {user.lastName}
              </p>
              <p className="font-thin text-xs">@{user.username}</p>
            </div>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="text-sm ml-4 mb-2">
          Manage your account settings and preferences.
        </DrawerDescription>
        {isExpanded ? (
          <div className="mx-4 max-h-132 md:max-h-70 flex md:flex-row flex-col overflow-y-scroll">
            <div className="flex flex-col md:flex-row sticky top-0 bg-base-100">
              <div className="flex w-full md:flex-col flex-row md:justify-start items-center justify-around gap-3">
                <p
                  className={`md:w-fit w-full flex justify-center py-1 md:px-2 rounded-lg ${
                    currentTab === 1
                      ? "text-primary bg-base-300"
                      : "text-base-content/70"
                  }`}
                >
                  <User
                    className={`${
                      currentTab === 1 ? "text-primary" : "text-base-content/70"
                    }`}
                    onClick={() => setCurrentTab(1)}
                  />
                </p>
                <p
                  className={`md:w-fit w-full flex justify-center py-1 md:px-2 rounded-lg ${
                    currentTab === 2
                      ? "text-primary bg-base-300"
                      : "text-base-content/70"
                  }`}
                >
                  <Shield onClick={() => setCurrentTab(2)} />
                </p>
              </div>
              <div className="divider md:divider-horizontal divider-vertical"></div>
            </div>
            {currentTab === 1 ? (
              <div className="w-full">
                <h2 className="text-lg font-bold">Profile details</h2>
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row">
                  <p className="tet-md font-semibold mr-2 md:mt-2 md:basis-50">
                    Profile
                  </p>
                  <div className="flex items-center justify-between gap-4 w-full mt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={user.imageUrl}
                        alt={"usrimg"}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <p className="text-sm font-semibold ml-2">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <UpdateUserDialog user={user} />
                  </div>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row w-full">
                  <p className="tet-md font-semibold mr-2 md:basis-50">
                    Username
                  </p>
                  <div className="w-full flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-base-content/80">
                      {user.username}
                    </p>
                    <UpdateUsernameDialog user={user} />
                  </div>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row w-full">
                  <p className="tet-md font-semibold mt-2 md:basis-50">
                    Emails
                  </p>
                  <div className="flex w-full">
                    <div className="flex w-full flex-col">
                      {user.emailAddresses.map((email) => (
                        <div
                          key={email.id}
                          className="w-full flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-base-content/80 ml-2">
                              {email.emailAddress}
                            </p>
                            {email.verification.status === "verified" ? (
                              <BadgeCheck size={15} className="text-success" />
                            ) : (
                              <ShieldAlert size={15} className="text-error" />
                            )}
                            {email.id === user.primaryEmailAddressId && (
                              <div className="badge">primary</div>
                            )}
                          </div>
                          <EmailActionsPopover user={user} email={email} />
                        </div>
                      ))}
                      <UpdateEmailDialog user={user} />
                    </div>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row w-full">
                  <p className="tet-md font-semibold mt-2 md:basis-50">
                    Connections
                  </p>
                  <div className="flex w-full">
                    <div className="flex w-full">
                      {user.externalAccounts.map((account, idx) => (
                        <ConnectionsActions
                          key={idx}
                          user={user}
                          externalAccount={account}
                        />
                      ))}
                      <ConnectionsPopover user={user} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <h2 className="text-lg font-bold">Security</h2>
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row w-full gap-4">
                  <p className="font-semibold mt-2 md:basis-40">Passwords</p>
                  <div className="w-full flex items-center md:justify-between">
                    <p>
                      {user.passwordEnabled ? "••••••••••••" : "No Passwords"}
                    </p>
                    <UpdatePasswordDialog user={user} />
                  </div>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row w-full gap-4">
                  <p className="font-semibold mb-1 md:basis-40">
                    Active Sessions
                  </p>
                  <div className="flex w-full flex-col items-start justify-between">
                    {sessions.map((session, idx) => (
                      <div key={idx} className="flex w-full items-center">
                        <div className="">
                          <div className="flex flex-col items-center gap-2 indicator">
                            {currentSessionId === session.id && (
                              <span className="indicator-item indicator-bottom status status-success"></span>
                            )}

                            {session.latestActivity.isMobile ? (
                              <Smartphone width={20} />
                            ) : (
                              <Monitor width={20} />
                            )}
                          </div>
                        </div>
                        <div className="divider divider-horizontal"></div>
                        <div className="w-full">
                          <p className="font-bold text-sm">
                            {session.latestActivity.deviceType}
                          </p>
                          <p className="text-xs">
                            {session.latestActivity.browserName}{" "}
                            {session.latestActivity.browserVersion}
                          </p>
                          <p className="text-xs">
                            {session.latestActivity.ipAddress} (
                            {session.latestActivity.city},{" "}
                            {session.latestActivity.country})
                          </p>
                          <p className="text-xs">
                            {formatRelativeTime(
                              session.lastActiveAt.toISOString()
                            )}
                          </p>
                        </div>
                        <RevokeSessionPopover
                          session={session}
                          currentSessionId={currentSessionId}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold mt-2">Delete Account</p>
                  <DeleteAccountAlert user={user} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full px-4">
            <button
              className="btn btn-ghost text-left"
              onClick={() => {
                setIsExpanded(true);
                setCurrentSessionId(getCurrentSessionIdFromCookie());
                getSession();
              }}
            >
              <Wrench />
              Manage Account
            </button>
          </div>
        )}
        <DrawerFooter className="flex flex-col items-end gap-2">
          <DrawerClose className="flex items-center gap-2">
            <SignOutButton signOutOptions={{ redirectUrl: pathname }}>
              <div className="btn btn-primary">Sign out</div>
            </SignOutButton>
            <a className="btn btn-primary rounded-full p-2" href="/">
              <img
                src={"/assets/images/nanogram_logo-no-bg.svg"}
                alt="logo"
                className="size-6"
              />
            </a>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function ConnectionsActions({
  user,
  externalAccount,
}: {
  user: UserResource;
  externalAccount: ExternalAccountResource;
}) {
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);
  const removeConnection = useReverification(() => externalAccount.destroy(), {
    onNeedsReverification: ({ level, complete, cancel }) => {
      setVrState({ inProgress: true, complete, cancel, level });
    },
  });
  async function handleRemoveConnection() {
    try {
      await removeConnection();
      console.log("Connection removed successfully");
    } catch (error) {
      console.error("Error removing connection:", error);
    }
  }
  return (
    <Popover>
      <PopoverTrigger>
        {externalAccount.provider === "google" && (
          <div className="btn bg-white text-black border-[#e5e5e5]">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Google
          </div>
        )}
        {externalAccount.provider === "github" && (
          <div className="btn bg-black text-white border-black">
            <svg
              aria-label="GitHub logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              ></path>
            </svg>
            GitHub
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent>
        {vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <button
            className="btn btn-error"
            onClick={() => handleRemoveConnection()}
          >
            Remove
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

function ConnectionsPopover({ user }: { user: UserResource }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [connections, setConnections] = useState(
    user.primaryEmailAddress?.linkedTo || []
  );
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);
  const createExternalConnection = useReverification(
    (params: CreateExternalAccountParams) =>
      user?.createExternalAccount(params),
    {
      onNeedsReverification: ({ level, complete, cancel }) => {
        setVrState({ inProgress: true, complete, cancel, level });
      },
    }
  );

  const handleConnect = async (type: "oauth_google" | "oauth_github") => {
    console.log("Connecting account:", type);
    try {
      const externalAccount = await createExternalConnection({
        strategy: type,
        redirectUrl: `/callback?redirect_url=${encodeURIComponent(
          window.location.href
        )}`,
      });
      const redirectUrl =
        externalAccount.verification?.externalVerificationRedirectURL;
      if (redirectUrl) {
        router.push(redirectUrl.toString());
      }
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  if (connections.length === 0) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="btn btn-ghost">
          + Connect Account
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          {vrState?.inProgress ? (
            <VerificationComponent
              level={vrState?.level}
              onComplete={vrState?.complete}
              onCancel={vrState?.cancel}
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                className="btn  bg-white text-black border-[#e5e5e5]"
                onClick={() => handleConnect("oauth_google")}
              >
                <svg
                  aria-label="Google logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#fff"></path>
                    <path
                      fill="#34a853"
                      d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                      fill="#4285f4"
                      d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                  </g>
                </svg>
                Google
              </button>
              <button
                className="btn bg-black text-white border-black"
                onClick={() => handleConnect("oauth_github")}
              >
                <svg
                  aria-label="GitHub logo"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="white"
                    d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                  ></path>
                </svg>
                GitHub
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="btn btn-ghost">
        + Connect Account
      </PopoverTrigger>
      <PopoverContent>
        {vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            {connections.map((connection, idx) => (
              <div key={idx} className="flex felx-col items-center gap-2">
                {connection.type !== "oauth_google" && (
                  <button
                    className="btn  bg-white text-black border-[#e5e5e5]"
                    onClick={() => handleConnect("oauth_google")}
                  >
                    <svg
                      aria-label="Google logo"
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <g>
                        <path d="m0 0H512V512H0" fill="#fff"></path>
                        <path
                          fill="#34a853"
                          d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                        ></path>
                        <path
                          fill="#4285f4"
                          d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                        ></path>
                        <path
                          fill="#fbbc02"
                          d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                        ></path>
                        <path
                          fill="#ea4335"
                          d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                        ></path>
                      </g>
                    </svg>
                    Google
                  </button>
                )}
                {connection.type !== "oauth_github" && (
                  <button
                    className="btn bg-black text-white border-black"
                    onClick={() => handleConnect("oauth_github")}
                  >
                    <svg
                      aria-label="GitHub logo"
                      width="16"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="white"
                        d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                      ></path>
                    </svg>
                    GitHub
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function EmailActionsPopover({
  user,
  email,
}: {
  user: UserResource;
  email: EmailAddressResource;
}) {
  const [option, setOption] = useState<"verify" | "button">("button");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);

  const setPrimaryEmailAddress = useReverification(
    (params) => user.update(params),
    {
      onNeedsReverification: ({ level, complete, cancel }) => {
        setVrState({ inProgress: true, complete, cancel, level });
      },
    }
  );

  const destroyEmailAddress = useReverification(() => email.destroy(), {
    onNeedsReverification: ({ level, complete, cancel }) => {
      setVrState({ inProgress: true, complete, cancel, level });
    },
  });

  async function setPrimaryEmail() {
    setLoading(true);
    try {
      const res = await setPrimaryEmailAddress({
        primaryEmailAddressId: email.id,
      });
      await user.reload();
      if (!res) {
        console.error("Failed to set primary email:", res);
        return;
      }
    } catch (error) {
      console.error("Error setting primary email:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEmail() {
    setLoading(true);
    try {
      await destroyEmailAddress();
      await user.reload();
    } catch (err) {
      console.error("Error deleting email:", err);
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmail() {
    setOption("verify");
    try {
      email.prepareVerification({ strategy: "email_code" });
      const emailVerifyAttempt = await email?.attemptVerification({
        code,
      });
      if (emailVerifyAttempt?.verification.status === "verified") {
        setSuccessful(true);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(emailVerifyAttempt, null, 2));
      }
    } catch (err) {
      console.error("Error verifying email:", err);
    }
  }
  return (
    <Popover>
      <PopoverTrigger className="btn btn-ghost">
        <Ellipsis />
      </PopoverTrigger>
      <PopoverContent>
        {option === "verify" ? (
          <form className="flex flex-col gap-2 w-70" onSubmit={verifyEmail}>
            <p className="text-sm">
              A verification code has been sent to{" "}
              <span className="font-semibold">{email.emailAddress}</span>.
              Please enter the code below to verify your email address.
            </p>
            <OtpInput onChange={(e) => setCode(e)} />
            <button
              type="submit"
              className={`btn ${successful ? "btn-success" : "btn-primary"}`}
            >
              {successful ? "Verified ✔️" : "Verify"}
            </button>
          </form>
        ) : vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <div className="flex flex-col w-40 gap-2">
            {email.verification.status !== "verified" && (
              <button
                className="btn btn-soft btn-success"
                onClick={() => setOption("verify")}
              >
                {loading ? (
                  <span className="loading loading-sm"></span>
                ) : (
                  "Verify"
                )}
              </button>
            )}
            {email.id !== user.primaryEmailAddressId && (
              <button
                className="btn btn-soft btn-primary"
                onClick={() => setPrimaryEmail()}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-sm"></span>
                ) : (
                  "Set as primary"
                )}
              </button>
            )}
            <button
              className="btn btn-error btn-soft"
              onClick={() => deleteEmail()}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-sm"></span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function UpdateEmailDialog({ user }: { user: UserResource }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [successful, setSuccessful] = React.useState(false);
  const [emailObj, setEmailObj] = React.useState<
    EmailAddressResource | undefined
  >();
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);
  const createEmailAddress = useReverification(
    (email: string) => user?.createEmailAddress({ email }),
    {
      onNeedsReverification: ({ level, complete, cancel }) => {
        setVrState({ inProgress: true, complete, cancel, level });
      },
    }
  );

  const AddEmailSchema = z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
  });

  type AddEmailFormData = z.infer<typeof AddEmailSchema>;

  const {
    register: registerAddEmail,
    handleSubmit: handleAddEmailSubmit,
    formState: { errors: addEmailErrors },
  } = useForm<AddEmailFormData>({
    resolver: zodResolver(AddEmailSchema),
  });

  const handleSubmit = async (data: AddEmailFormData) => {
    setLoading(true);
    try {
      // Add an unverified email address to user
      console.log("Adding email address:", data.email);
      const res = await createEmailAddress(data.email);
      // Reload user to get updated User object
      await user.reload();

      // Find the email address that was just added
      const emailAddress = user.emailAddresses.find((a) => a.id === res?.id);
      // Create a reference to the email address that was just added
      setEmailObj(emailAddress);

      // Send the user an email with the verification code
      emailAddress?.prepareVerification({ strategy: "email_code" });

      // Set to true to display second form
      // and capture the OTP code
      setIsVerifying(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };
  // Handle the submission of the verification form
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Verify that the code entered matches the code sent to the user
      const emailVerifyAttempt = await emailObj?.attemptVerification({
        code,
      });

      if (emailVerifyAttempt?.verification.status === "verified") {
        setSuccessful(true);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(emailVerifyAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="btn btn-ghost w-fit">
        + Add email address
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Email Address</DialogTitle>
          <DialogDescription>
            You'll need to verify this email address before it can be added to
            your account.
          </DialogDescription>
        </DialogHeader>
        {isVerifying ? (
          <form onSubmit={(e) => verifyCode(e)}>
            <OtpInput onChange={(e) => setCode(e)} />

            <DialogFooter>
              <DialogClose className="btn btn-error" type="button">
                Cancel
              </DialogClose>
            </DialogFooter>
          </form>
        ) : vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <form onSubmit={handleAddEmailSubmit(handleSubmit)}>
            <div className="mb-2.5">
              <label className="input validator w-full">
                <input
                  type="email"
                  required
                  placeholder="New Email Address"
                  {...registerAddEmail("email")}
                />
              </label>
              {addEmailErrors.email && (
                <p className="text-sm mt-1 text-warning">
                  {addEmailErrors.email.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose className="btn btn-error" type="button">
                Cancel
              </DialogClose>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isVerifying}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add Email"
                )}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UpdateUsernameDialog({ user }: { user: UserResource }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);

  const changeUsername = useReverification((params) => user.update(params), {
    onNeedsReverification: ({ complete, cancel, level }) => {
      setVrState({ inProgress: true, complete, cancel, level });
    },
  });

  const UsernameSchema = z.object({
    // Validate username with Zod no spaces, special characters, and length
    username: z
      .string()
      .min(4, "Username is required")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
  });

  type UsernameFormData = z.infer<typeof UsernameSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: user.username || "",
    },
  });

  async function updateUsername(data: UsernameFormData) {
    if (!user) {
      return;
    }
    console.log("Updating username with data:", data);
    setLoading(true);
    try {
      const res = await changeUsername({
        username: data.username,
      });
      if (!res) {
        console.error("Failed to update username:", res);
        return;
      }
    } catch (error) {
      console.error("Error updating username:", error);
    } finally {
      user.reload();
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="btn btn-ghost">Update Username</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Username</DialogTitle>
          <DialogDescription>
            Enter a new username for your account.
          </DialogDescription>
        </DialogHeader>
        {vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <form onSubmit={handleSubmit(updateUsername)}>
            <div className="mb-2.5">
              <label className="input validator w-full">
                <input
                  type="text"
                  required
                  placeholder="New Username"
                  {...register("username")}
                />
              </label>
              {errors.username && (
                <p className="text-sm mt-1 text-warning">
                  {errors.username.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <DialogClose
                disabled={loading}
                className="btn btn-error brn-block"
              >
                Close
              </DialogClose>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Update Username"
                )}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UpdateUserDialog({ user }: { user: UserResource }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);

  const updateUserProfile = useReverification((params) => user.update(params), {
    onNeedsReverification: ({ complete, cancel, level }) => {
      setVrState({ inProgress: true, complete, cancel, level });
    },
  });
  const updateProfileImage = useReverification(
    (params) => user.setProfileImage(params),
    {
      onNeedsReverification: ({ complete, cancel, level }) => {
        setVrState({ inProgress: true, complete, cancel, level });
      },
    }
  );

  const ProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    file: z.any().refine((file) => file instanceof File || file === null, {
      message: "A valid image file is required",
    }),
  });

  type ProfileFormData = z.infer<typeof ProfileSchema>;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      file: null, // Initialize file as null
    },
  });

  async function updateProfile(data: ProfileFormData) {
    if (!user) {
      return;
    }
    console.log("Updating profile with data:", data);
    setLoading(true);
    try {
      // If a file is provided, upload it
      if (data.file) {
        const uploadResult = await updateProfileImage({
          file: data.file,
        });
        if (!uploadResult) {
          console.error("Failed to upload profile image:", uploadResult);
          return;
        }
        console.log("Profile image uploaded successfully");
      }
      const res = await updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (!res) {
        console.error("Failed to update profile:", res);
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      user.reload();
      setLoading(false);
      setOpen(false);
    }
  }

  async function removeProfileImage() {
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      const res = await updateProfileImage({
        file: null, // Set file to null to remove the profile image
      });
      if (!res) {
        console.error("Failed to remove profile image:", res);
        return;
      }
      console.log("Profile image removed successfully");
      setValue("file", null); // Reset file input
    } catch (error) {
      console.error("Error removing profile image:", error);
    } finally {
      user.reload();
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="btn btn-ghost">Update Profile</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information including your name and profile
            picture.
          </DialogDescription>
        </DialogHeader>
        {vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <form onSubmit={handleSubmit(updateProfile)}>
            <div className="md:h-100 h-140 overflow-y-scroll">
              <div className="mb-2.5">
                <label htmlFor="first name" className="input validator w-full">
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    {...register("firstName")}
                  />
                </label>
                {errors.firstName && (
                  <p className="text-sm mt-1 text-warning">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="mb-2.5">
                <label htmlFor="last name" className="input validator w-full">
                  <input
                    type="text"
                    required
                    placeholder="last Name"
                    {...register("lastName")}
                  />
                </label>
                {errors.lastName && (
                  <p className="text-sm mt-1 text-warning">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="divider"></div>
              <div className="mb-2.5">
                <label className="w-full flex items-center justify-center">
                  <FileUploader
                    onFileChange={(file) => setValue("file", file)}
                    initialFileUrl={user.imageUrl}
                    acceptedFileTypes={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                    enableImageCropping={true}
                    cropAspectRatio={1}
                    cropperStyle={{ width: "100%", height: "25%" }}
                  />
                </label>
                {typeof errors.file?.message === "string" && (
                  <p className="text-sm mt-1 text-warning">
                    {errors.file.message}
                  </p>
                )}
              </div>
              <div className="divider"></div>
            </div>
            <DialogFooter className="mt-2">
              <DialogClose
                disabled={loading}
                className="btn btn-error brn-block"
              >
                Close
              </DialogClose>
              <button
                type="button"
                className="btn btn-error btn-outline"
                onClick={removeProfileImage}
                disabled={loading}
              >
                Remove Profile Image
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UpdatePasswordDialog({ user }: { user: UserResource }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);
  const changeUserPassword = useReverification(
    (params: UpdateUserPasswordParams) => user.updatePassword(params),
    {
      onNeedsReverification: ({ complete, cancel, level }) => {
        setVrState({ inProgress: true, complete, cancel, level });
      },
    }
  );

  const UpdatePasswordSchema = z.object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    signOutOfOtherSessions: z.boolean().optional(),
  });

  type UpdatePasswordFormData = z.infer<typeof UpdatePasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      signOutOfOtherSessions: false,
    },
  });

  async function updatePassword(data: UpdatePasswordFormData) {
    console.log("Updating password with data:", data);
    setLoading(true);
    try {
      const res = await changeUserPassword({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
        signOutOfOtherSessions: data.signOutOfOtherSessions,
      });
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="btn btn-ghost">Update Password</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Enter your current password and new password.
          </DialogDescription>
        </DialogHeader>
        {vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <form onSubmit={handleSubmit(updatePassword)}>
            <div>
              <div className="mb-2.5">
                <label className="input validator w-full">
                  <input
                    type="text"
                    required
                    placeholder="Current Password"
                    {...register("currentPassword")}
                  />
                </label>
                {errors.currentPassword && (
                  <p className="text-sm mt-1 text-warning">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="mb-2.5">
                <label className="input validator w-full">
                  <input
                    type="text"
                    required
                    placeholder="New Password"
                    {...register("newPassword")}
                  />
                </label>
                {errors.newPassword && (
                  <p className="text-sm mt-1 text-warning">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="mb-2.5">
                <label className="validator w-full flex">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary mt-2"
                    {...register("signOutOfOtherSessions")}
                  />
                  <div className="ml-3">
                    <p className="text-sm">Sign out of all other devices</p>
                    <p className="text-xs">
                      It is recommended to sign out of all other devices which
                      may have used your old password.
                    </p>
                  </div>
                </label>
                {errors.signOutOfOtherSessions && (
                  <p className="text-sm mt-1 text-warning">
                    {errors.signOutOfOtherSessions.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <p className="btn btn-error">Cancel</p>
              </DialogClose>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Update Password"
                )}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RevokeSessionPopover({
  session,
  currentSessionId,
}: {
  session: SessionWithActivitiesResource;
  currentSessionId: string | null;
}) {
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);

  const [open, setOpen] = useState(false); // control Popover visibility

  const revokeSession = useReverification(() => session.revoke(), {
    onNeedsReverification: ({ complete, cancel, level }) => {
      setVrState({
        inProgress: true,
        level,
        complete: () => {
          complete();
          setOpen(false); // close popover on complete
        },
        cancel: () => {
          cancel();
          setOpen(false); // close popover on cancel
        },
      });
    },
  });

  async function revokeSessionHandler() {
    if (!session) return;
    await revokeSession()
      .then(() => {
        console.log("Session revoked successfully");
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error revoking session:", error);
      });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="btn btn-ghost"
        disabled={currentSessionId === session.id}
        onClick={() => {
          setOpen(true);
          revokeSessionHandler();
        }}
      >
        Sign Out
      </PopoverTrigger>
      <PopoverContent>
        {vrState?.inProgress ? (
          <VerificationComponent
            level={vrState.level}
            onComplete={vrState.complete}
            onCancel={vrState.cancel}
          />
        ) : (
          <div className="w-full flex items-center justify-center text-base-content">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function DeleteAccountAlert({ user }: { user: UserResource }) {
  const { signOut } = useClerk();
  const pathname = usePathname();

  const [value, setValue] = useState("");
  const [vrState, setVrState] = useState<{
    inProgress: boolean;
    complete: () => void;
    cancel: () => void;
    level?: "first_factor" | "second_factor" | "multi_factor";
  } | null>(null);

  const deleteUserAccount = useReverification(() => user.delete(), {
    onNeedsReverification: ({ complete, cancel, level }) => {
      setVrState({ inProgress: true, complete, cancel, level });
    },
  });

  async function deleteUser() {
    if (!user) {
      return;
    }
    await deleteUserAccount();

    signOut({ redirectUrl: pathname });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="btn btn-soft btn-error">Delete Account</div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {vrState?.inProgress ? (
          <VerificationComponent
            level={vrState?.level}
            onComplete={vrState?.complete}
            onCancel={vrState?.cancel}
          />
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <label
              htmlFor="confirmation"
              className="text-sm text-base-content/70"
            >
              Type "DELETE" to confirm
              <input
                type="text"
                className="input mt-2"
                onChange={(e) => setValue(e.target.value)}
              />
            </label>
            <AlertDialogFooter>
              <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="btn btn-error"
                disabled={value !== "DELETE"}
                onClick={deleteUser}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ProfileDrawer;
