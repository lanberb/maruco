import {
  CLIENT_STORAGE_KEY,
  createValue,
  createWords,
  getSavedValue,
  validateComponentName,
} from "./utils";

function getValidationSummary(value: Value): Result[] {
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

  return result;
}

async function main() {
  figma.skipInvisibleInstanceChildren = true;
  figma.showUI(__html__, {
    width: 400,
    height: 656,
    themeColors: true,
  });
  const value = await getSavedValue();

  switch (figma.command) {
    case "run": {
      figma.ui.postMessage({
        type: "setViewMode",
        data: "checking",
      });
      const result = getValidationSummary(value);

      figma.ui.postMessage({
        type: "validated",
        data: result,
      });

      figma.notify("Checked / テストが実行されました");
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
  const value = await getSavedValue();

  figma.ui.postMessage({
    type: "run",
    data: value,
  });
});

figma.ui.on("message", async (msg: { type: string; data: unknown }) => {
  let value = await getSavedValue();

  switch (msg.type) {
    case "update": {
      const data = msg.data as Partial<Value>;

      value = createValue({
        ...value,
        mode: data.mode ?? value.mode,
        words: {
          primary: createWords(data.words?.primary ?? []),
          secondary: createWords(data.words?.secondary ?? []),
          tertiary: createWords(data.words?.tertiary ?? []),
        },
      });

      try {
        await figma.clientStorage.setAsync(CLIENT_STORAGE_KEY, value);
        figma.notify("Saved / データが保存されました");
      } catch {
        figma.notify("Cannot Saved / データが保存できませんでした");
      }
      break;
    }
    case "zoomNodeById": {
      const data = msg.data as string;
      const node = await figma.getNodeByIdAsync(data);

      if (node != null) {
        figma.viewport.scrollAndZoomIntoView([node]);
      } else {
        figma.notify("Cannot Find / 選択したNodeが発見できませんでした");
      }
      break;
    }
    case "runningValidation": {
      const result = getValidationSummary(value);

      figma.ui.postMessage({
        type: "validated",
        data: result,
      });

      figma.notify("Checked / テストが実行されました");
      break;
    }
    default: {
      break;
    }
  }

  figma.ui.postMessage({
    type: "response",
    data: value,
  });
});
