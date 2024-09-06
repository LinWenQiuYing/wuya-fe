import { describe, expect, test } from "vitest";
import pickMenu from "../pickMenu";
import { RouteRecordRaw } from "vue-router";
import { FunctionalComponent } from "vue";
import { Nav } from "@/@types";

describe("pickMenu", () => {
  test("pick menu normally", () => {
    const icon: FunctionalComponent = () => <svg></svg>;
    const View: FunctionalComponent = () => <span>test component</span>;
    const routes: Readonly<RouteRecordRaw[]> = [
      {
        path: "/admin",
        component: View,
        children: [
          {
            path: "",
            component: View,
            meta: { nav: { name: "a", icon } },
          },
          {
            path: "b",
            component: View,
          },
          {
            path: "c",
            component: View,
            meta: { nav: { name: "c", icon } },
          },
          {
            path: "d",
            component: View,
            meta: {
              nav: { name: "d", icon, active: { any: ["/admin/*", "/test"] } },
            },
          },
        ],
      },
    ];
    expect(pickMenu(routes)).toStrictEqual([
      {
        name: "a",
        icon,
        path: "/admin",
      },
      {
        name: "c",
        icon,
        path: "/admin/c",
      },
      {
        name: "d",
        icon,
        path: "/admin/d",
        active: { any: ["/admin/*", "/test"] },
      },
    ] satisfies Nav[]);
  });

  test("recursive pick menu", () => {
    const icon: FunctionalComponent = () => <svg></svg>;
    const View: FunctionalComponent = () => <span>test component</span>;
    const routes: Readonly<RouteRecordRaw[]> = [
      {
        path: "/admin",
        component: View,
        meta: { nav: { name: "admin", icon } },
        children: [
          {
            path: "b",
            component: View,
            children: [
              {
                path: "c",
                component: View,
              },
              {
                path: "d",
                component: View,
                meta: { nav: { name: "d", icon } },
              },
            ],
          },
          {
            path: "e",
            component: View,
          },
          {
            path: "f",
            component: View,
            meta: { nav: { name: "f", icon } },
          },
        ],
      },
    ];
    expect(pickMenu(routes)).toStrictEqual([
      {
        name: "admin",
        icon,
        path: "/admin",
      },
      {
        name: "d",
        icon,
        path: "/admin/b/d",
      },
      {
        name: "f",
        icon,
        path: "/admin/f",
      },
    ] satisfies Nav[]);
  });

  test("pick cross platform icon", () => {
    const h5Icon: FunctionalComponent = () => <svg>h5</svg>;
    const pcIcon: FunctionalComponent = () => <svg>pc icon 1</svg>;
    const pcIcon2: FunctionalComponent = () => <svg>pc icon 2</svg>;
    const View: FunctionalComponent = () => <span>test component</span>;
    const routes: Readonly<RouteRecordRaw[]> = [
      {
        path: "/a",
        component: View,
        meta: {
          nav: {
            name: "a",
            icon: {
              pc: pcIcon,
            },
          },
        },
      },
      {
        path: "/b",
        component: View,
        meta: {
          nav: {
            name: "b",
            icon: {
              pc: pcIcon2,
              h5: h5Icon,
            },
          },
        },
      },
    ];
    expect(pickMenu(routes, "pc")).toStrictEqual([
      {
        name: "a",
        path: "/a",
        icon: pcIcon,
      },
      {
        name: "b",
        path: "/b",
        icon: pcIcon2,
      },
    ] satisfies Nav[]);

    expect(pickMenu(routes, "h5")).toStrictEqual([
      {
        name: "a",
        path: "/a",
        icon: pcIcon,
      },
      {
        name: "b",
        path: "/b",
        icon: h5Icon,
      },
    ] satisfies Nav[]);
  });
});
