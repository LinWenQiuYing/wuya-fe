const handleObj = {
  singleClickFlag: true, // true单击事件，false双击事件
  timer: null,
  fn: null,
  params: null,
};

export function singleClickEvents(cy, callback) {
  cy.on("click", async (ev) => {
    handleObj.fn = callback;
    handleObj.singleClickFlag = false;
    handleObj.timer = setTimeout(() => {
      handleObj.singleClickFlag = true;
    }, 300);
    handleObj.params = ev.target;
    let json = null;
    if (ev.target.isNode && ev.target.isNode()) {
      json = {
        id: ev.target._private.data.id,
        type: ev.target._private.group,
      };
    }
    if (ev.target.isEdge && ev.target.isEdge()) {
      json = {
        id: ev.target._private.data.uuid,
        type: ev.target._private.group,
      };
    }
    // 知识建模模块使用
    // const res = await import(`/@/store/index`)
    // res.store.dispatch('createModel/SELECT_GRAPH_OBJ_ACTION', json)
  });
}

export function dbclickEvents(cy, callback) {
  cy.on("dblclick", (ev) => {
    if (handleObj.timer) {
      for (let i = 0; i < 1000; i++) {
        clearTimeout(i);
      }
    }
    callback(ev.target._private.data);
  });
}

// 右键
export function cxttapstartEvents(cy, callback) {
  cy.on("cxttapstart", (ev) => {
    if (handleObj.timer) {
      for (let i = 0; i < 1000; i++) {
        clearTimeout(i);
      }
    }
    callback(ev.target._private.data, ev.target._private.group, ev.renderedPosition);
  });
}

export function mouseupEvents(cy, callback) {
  cy.on("mouseup", (ev) => {
    callback(ev.target);
  });
}

Object.defineProperty(handleObj, "singleClickFlag", {
  get: function () {
    return this.singleClickFlag;
  },
  set: function (value) {
    if (value) {
      if (handleObj.params._private && handleObj.params._private.container) {
        handleObj.fn([]);
      } else if (handleObj.params.isNode()) {
        handleObj.fn([handleObj.params.id()]);
      } else if (handleObj.params.isEdge()) {
        handleObj.fn([handleObj.params.source().id(), handleObj.params.target().id()], handleObj.params);
      }
    }
  },
});
