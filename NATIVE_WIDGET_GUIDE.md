// ===================================================================
// GUIDE: Native Android Widget Integration for Taskify
// ===================================================================

## Вариант 1: Использовать expo-widget (РЕКОМЕНДУЕТСЯ)

### 1. Установка зависимости

```bash
npx expo install expo-widget
```

### 2. Обновить app.json

```json
{
  "expo": {
    "plugins": [
      "expo-build-properties",
      [
        "expo-widget",
        {
          "widgets": [
            {
              "name": "TaskifyWidget",
              "description": "Quick task management widget",
              "displayName": "Taskify Widget",
              "minWidth": 40,
              "minHeight": 40,
              "previewImage": "./assets/widget-preview.png"
            }
          ]
        }
      ]
    ]
  }
}
```

### 3. Создать widget component

```tsx
// src/widgets/NativeAndroidWidget.tsx
import React from 'react';
import { WidgetTaskList } from 'expo-widget';

export const NativeAndroidWidget = () => {
  // Будет автоматически получать данные из widgetService
  return (
    <WidgetTaskList
      source="@TaskifyWidget:data"
    />
  );
};
```

### 4. Обновить widgetService для работы с нативным виджетом

```typescript
// src/utils/widgetService.ts
// Уже готов к использованию!
// Просто данные сохраняются в AsyncStorage
// Нативный виджет их читает оттуда
```

---

## Вариант 2: Полностью нативный виджет (ПРОДВИНУТЫЙ)

Требует Kotlin/Java кода, но полностью нативный опыт.

### Файлы которые нужны:

1. **android/app/src/main/kotlin/com/iliyar/taskify/TaskifyWidget.kt**
```kotlin
package com.iliyar.taskify

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.iliyar.taskify.workers.WidgetUpdateWorker
import java.util.concurrent.TimeUnit

class TaskifyWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
        
        // Запланировать периодическое обновление каждые 15 минут
        val updateRequest = PeriodicWorkRequestBuilder<WidgetUpdateWorker>(
            15, TimeUnit.MINUTES
        ).build()
        
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            "widget_update",
            ExistingPeriodicWorkPolicy.KEEP,
            updateRequest
        )
    }

    companion object {
        private fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_layout)
            
            // Получить данные из AsyncStorage/SharedPreferences
            val sharedPref = context.getSharedPreferences(
                "TaskifyWidget",
                Context.MODE_PRIVATE
            )
            
            // Обновить UI элементы
            val tasks = sharedPref.getString("tasks", "")
            views.setTextViewText(R.id.widget_title, "Taskify")
            
            // Intent для открытия приложения
            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)
            
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
```

2. **android/app/src/main/res/layout/widget_layout.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/widget_bg"
    android:padding="16dp"
    android:orientation="vertical">

    <TextView
        android:id="@+id/widget_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Taskify"
        android:textSize="18sp"
        android:textColor="#1E293B"
        android:textStyle="bold" />

    <ProgressBar
        android:id="@+id/widget_progress"
        android:layout_width="match_parent"
        android:layout_height="8dp"
        android:layout_marginTop="12dp"
        android:progress="70"
        style="@android:style/Widget.ProgressBar.Horizontal" />

    <TextView
        android:id="@+id/widget_stats"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="7/10 completed"
        android:textSize="12sp"
        android:textColor="#94A3B8"
        android:layout_marginTop="8dp" />
</LinearLayout>
```

3. **android/app/src/main/AndroidManifest.xml**
```xml
<!-- Добавить внутри <manifest> -->
<receiver
    android:name=".TaskifyWidget"
    android:label="Taskify Widget"
    android:exported="true">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/widget_info" />
</receiver>
```

4. **android/app/src/main/res/xml/widget_info.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="180dp"
    android:updatePeriodMillis="900000"
    android:previewImage="@drawable/widget_preview"
    android:initialLayout="@layout/widget_layout"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
```

---

## Вариант 3: React Native для Widget (СРЕДНИЙ)

Используем `react-native-widget`:

### Установка
```bash
npm install react-native-widget
npx pod-install
```

### Использование
```tsx
import { createWidget } from 'react-native-widget';

createWidget({
  name: 'TaskifyWidget',
  render: () => <HomeWidget {...props} />,
  widgetSize: 'medium',
});
```

---

## Сравнение подходов:

| Подход | Сложность | Функционал | Рекомендация |
|--------|-----------|-----------|--------------|
| expo-widget | Низкая | 70% | ✅ НАЧНИТЕ ОТСЮДА |
| React Native Widget | Средняя | 85% | Если expo не работает |
| Полностью нативный | Высокая | 100% | Для максимума контроля |

---

## Что можно делать с виджетом:

✅ **Если используете expo-widget:**
- Просмотр статистики
- Просмотр задач
- Нажатие для открытия приложения
- Auto-update каждые 15 минут

✅ **Если используете React Native Widget:**
- + Быстрое выполнение задач
- + Открытие конкретного экрана
- + Более плавные анимации

✅ **Если используете полностью нативный:**
- + ВСЕ действия из react-native
- + Custom UI полностью на Kotlin
- + Максимальная производительность

---

## Рекомендуемый путь (БЫСТРО):

### Шаг 1: Установить expo-widget
```bash
npx expo install expo-widget
```

### Шаг 2: Обновить app.json
Добавить конфиг expo-widget

### Шаг 3: Собрать и установить
```bash
npx eas build --platform android
```

### Шаг 4: Добавить на главный экран
- Долгое нажатие на главный экран
- "Виджеты" → "Taskify" → добавить

---

## Текущее состояние Taskify:

✅ **Уже готово:**
- widgetService для синхронизации данных
- HomeWidget компонент
- AsyncStorage для хранения
- Real-time обновления

❌ **Нужно добавить:**
- expo-widget зависимость
- Native widget конфигурация

---

## Хотите я добавлю это?

Я могу сделать one of:

1. **expo-widget** (быстро, 5 минут)
   - Простейший вариант
   - Базовый функционал
   
2. **React Native Widget** (15 минут)
   - Больше интерактивности
   - Работает с вашим кодом

3. **Полностью нативный** (30+ минут)
   - Максимальный контроль
   - Требует Kotlin кода

Что выберете?
