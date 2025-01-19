import { createValue, createWords, validateComponentName } from "./utils";

const CLIENT_STORAGE_KEY = `name-ruler-${figma.fileKey}`;

async function main() {
  figma.skipInvisibleInstanceChildren = true;
  figma.showUI(__html__, {
    width: 400,
    height: 360,
    // height: 400,
    themeColors: true,
  });
  const savedValue = await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY);
  const value = createValue(savedValue == null ? {} : savedValue);

  switch (figma.command) {
    case "run": {
      figma.ui.postMessage({
        type: "setViewMode",
        data: "logging",
      });

      const allNodes = figma.currentPage.findAll();
      const targetNodes = allNodes.filter((node) => {
        return (
          node.type === "COMPONENT_SET" ||
          (node.type === "COMPONENT" && node.parent?.type !== "COMPONENT_SET")
        );
      });

      const result = targetNodes.map(({ id, name }) => {
        return {
          id,
          name,
          status: validateComponentName({ ...value, name }),
        };
      });

      figma.ui.postMessage({
        type: "allNodesBeforeLinting",
        data: result,
      });

      figma.notify("チェックが実行されました");
      break;
    }
    case "setting":
      figma.ui.postMessage({
        type: "setViewMode",
        data: "setting",
      });
      break;
    default: {
      break;
    }
  }
}
main();

figma.once("run", async () => {
  const savedValue = await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY);
  const value = createValue(savedValue == null ? {} : savedValue);

  figma.ui.postMessage({
    type: "run",
    data: value,
  });
});

figma.ui.on("message", async (msg: { type: string; data: unknown }) => {
  const savedValue = await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY);
  let value = createValue(savedValue == null ? {} : savedValue);

  switch (msg.type) {
    case "update": {
      const data = msg.data as Partial<Value>;

      value = createValue({
        ...savedValue,
        mode: data.mode ?? savedValue.mode,
        words: {
          primary: createWords(data.words?.primary ?? []),
          secondary: createWords(data.words?.secondary ?? []),
          tertiary: createWords(data.words?.tertiary ?? []),
        },
      });
      break;
    }
    case "zoomNodeById": {
      const data = msg.data as string;
      const node = await figma.getNodeByIdAsync(data);

      if (node != null) {
        figma.viewport.scrollAndZoomIntoView([node]);
      } else {
        figma.notify("選択したNodeが発見できませんでした");
      }
      break;
    }
    default: {
      break;
    }
  }

  try {
    await figma.clientStorage.setAsync(CLIENT_STORAGE_KEY, value);
    figma.notify("データが保存されました");
  } catch {
    figma.notify("データが保存できませんでした");
  }

  figma.ui.postMessage({
    type: "response",
    data: value,
  });
});
