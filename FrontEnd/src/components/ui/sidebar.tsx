"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useCallback } from "react";
import { AnimatePresence, motion,isMotionValue  } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface MobileSidebarProps extends React.ComponentProps<"div"> {
  className?: string;
  children: React.ReactNode;
}
//@ts-ignore
const MobileSidebarWrapper = (props) => {
  // Destructure the children prop and filter out MotionValue
  const { children, ...restProps } = props;

  const filteredChildren = React.Children.map(children, (child) =>
    isMotionValue(child) ? null : child // Skip MotionValue children
  );

  return <MobileSidebar {...restProps}>{filteredChildren}</MobileSidebar>;
};

interface Links {
  label: string;
  href?: string;
  icon?: React.JSX.Element | React.ReactNode;
  component?: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebarWrapper {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};


export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleToggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <button
            onClick={handleToggle}
            className="bg-transparent border-none cursor-pointer p-0"
          >
            <IconMenu2 className="text-neutral-800 dark:text-neutral-200" />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <button
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 bg-transparent border-none cursor-pointer p-0"
                onClick={handleClose}
              >
                <IconX />
              </button>

              {React.Children.map(children, (child) =>
                React.isValidElement(child) ? (
                  React.cloneElement(child as React.ReactElement<any>, {
                    onClick: handleClose,
                  })
                ) : (
                  // If the child is not a valid React element, return it as is or skip it
                  child
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  textClassName,
  ...props
}: {
  link: Links & { component?: React.ReactNode };
  className?: string;
  textClassName?: string;
  props?: Omit<LinkProps, 'href'>;
}) => {
  const { open, animate } = useSidebar();

  const textClasses = cn(
    "text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0",
    textClassName
  );

  if (link.component) {
    return (
      <div
        className={cn(
          "flex items-center justify-start gap-2 group/sidebar py-2",
          className
        )}
        {...props}
      >
        {link.icon}
        <motion.div
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className={textClasses}
        >
          {link.component}
        </motion.div>
      </div>
    );
  }

  return link.href ? (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={textClasses}
      >
        {link.label}
      </motion.span>
    </Link>
  ) : null;
};
