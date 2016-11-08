/**
 * 
 * @author Алексей
 * @name initiSQLs
 * @public
 * Use it only to initialize metrika
 * it's don't need if you want to test server modules
 */

-- Table: mtk_labels

-- DROP TABLE mtk_labels;

CREATE TABLE mtk_labels
(
  mtk_labels_id numeric NOT NULL,
  label_name character varying(200),
  CONSTRAINT mtk_labels_pk PRIMARY KEY (mtk_labels_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mtk_labels
  OWNER TO transcard;

-- Table: mtk_shots

-- DROP TABLE mtk_shots;

CREATE TABLE mtk_shots
(
  mtk_shots_id numeric NOT NULL,
  mtk_label numeric(200,0),
  shot_time timestamp(6) with time zone,
  shot_message character varying(10),
  con_shot numeric(200,0),
  CONSTRAINT mtk_shots_pk PRIMARY KEY (mtk_shots_id),
  CONSTRAINT fk_1475670488274000000 FOREIGN KEY (mtk_label)
      REFERENCES mtk_labels (mtk_labels_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_1475831516163000000 FOREIGN KEY (con_shot)
      REFERENCES mtk_shots (mtk_shots_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mtk_shots
  OWNER TO transcard;
