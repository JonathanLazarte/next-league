import { FaCheck } from "react-icons/fa6";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import SearchField from "@/components/SearchField/SearchField";
import { useI18n } from "@/hooks/useI18n";
import type { Dispatch, SetStateAction } from "react";
import type { SortOptions, SortOptionsValues, FilterCategories } from "@/types/ui";
import type { ChampionRoles } from '@/types/champion'
import type { SkinFilterCategories } from "@/types/skin";

interface StoreSidePanelProps {
  subsections: string[];
  subsectionSelected: string;
  setSubsectionSelected: Dispatch<SetStateAction<string>>;
  searchKeys: string;
  setSearchKeys: Dispatch<SetStateAction<string>>;
  inCollection: boolean;
  setInCollection: Dispatch<SetStateAction<boolean>>;
  sortOptions: SortOptions;
  sortedBy: SortOptionsValues | null;
  setSortedBy: Dispatch<SetStateAction<SortOptionsValues | null>>;
  itemCategoryChecked?: ChampionRoles | SkinFilterCategories;
  setItemCategoryChecked?: Dispatch<SetStateAction<FilterCategories>>;
  championInCollection?: boolean;
  setChampionInCollection?: Dispatch<SetStateAction<boolean>>;
  showOnSale?: boolean;
  blueEssence?: boolean;
  onToggleBlueEssence?: () => void;
}

export default function StoreSidePanel({
  subsections,
  subsectionSelected,
  setSubsectionSelected,
  searchKeys,
  setSearchKeys,
  inCollection,
  setInCollection,
  sortOptions,
  sortedBy,
  setSortedBy,
  itemCategoryChecked,
  setItemCategoryChecked,
  championInCollection,
  setChampionInCollection,
  showOnSale = true,
  blueEssence = false,
  onToggleBlueEssence,
}: StoreSidePanelProps) {
  const { t } = useI18n();

  const handleCheckboxChange = (role: keyof FilterCategories) => {
    if (!setItemCategoryChecked) return;
    setItemCategoryChecked((prev) => ({
      ...prev,
      [role as keyof typeof prev]: !prev[role as keyof typeof prev],
    }));
  };

  return <div className="filter-nav">
    <section className="nav-section first">
      {subsections.map((subsection) => (
        <div
          key={subsection}
          onClick={() => setSubsectionSelected(subsection)}
          className="checkbox section"
        >
          <div className="custom-checkbox-romb">
            {subsectionSelected === subsection && (
              <div className="check-element" />
            )}
          </div>
          <div
            className={
              subsectionSelected === subsection ? "section-selected" : ""
            }
          >
            {t(`store.subsections.${subsection}`)}
          </div>
        </div>
      ))}
    </section>

    <section className="nav-section">
      <SearchField
        placeholder={t("common.search")}
        value={searchKeys}
        onChange={setSearchKeys}
      />
      <div
        onClick={() => setInCollection((prev) => !prev)}
        className="checkbox incollection"
      >
        <div className="custom-checkbox">
          {inCollection && <FaCheck className="check-icon" />}
        </div>
        {t("store.showOwned")}
      </div>
    </section>

    <section className="nav-section">
      <CustomSelect
        className="select-filter"
        options={sortOptions}
        value={sortedBy}
        onChange={setSortedBy}
        placeholder="common.select"
      />
      {championInCollection !== undefined && setChampionInCollection !== undefined && (
        <div
          onClick={() => setChampionInCollection((prev) => !prev)}
          className="checkbox"
        >
          <div className="custom-checkbox">
            {championInCollection && <FaCheck className="check-icon" />}
          </div>
          {t("store.championOwned")}
        </div>
      )}

      {itemCategoryChecked && (Object.keys(itemCategoryChecked) as Array<keyof FilterCategories>).map((cat) => (
        <div
          key={cat}
          className="checkbox"
          onClick={() => handleCheckboxChange(cat)}
        >
          <div className="custom-checkbox">
            {itemCategoryChecked[cat] && <FaCheck className="check-icon" />}
          </div>
          {t(`store.categories.${String(cat)}`)}
        </div>
      ))}
      {onToggleBlueEssence && (
        <div className="checkbox checkbox-wrap" onClick={onToggleBlueEssence}>
          <div className="custom-checkbox">
            {blueEssence && <FaCheck className="check-icon" />}
          </div>
          {t("store.blueEssence")}
        </div>
      )}
    </section>

    {showOnSale && (
      <section className="nav-section last">
        <div className="checkbox">
          <div className="custom-checkbox" />
          {t("store.onSale")}
        </div>
      </section>
    )}
  </div>
}
