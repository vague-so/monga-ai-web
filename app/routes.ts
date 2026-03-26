import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/playground/layout.tsx", [
    route("playground", "routes/playground/generate.tsx"),
    route("playground/generations", "routes/playground/generations.tsx"),
    route("playground/models", "routes/playground/models.tsx"),
    route("playground/blocks", "routes/playground/blocks.tsx"),
    route("playground/r2", "routes/playground/r2.tsx"),
    route("playground/cost", "routes/playground/cost.tsx"),
  ]),
] satisfies RouteConfig;
